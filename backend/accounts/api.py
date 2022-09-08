from email import message
from multiprocessing import context
from rest_framework import generics, permissions, views, viewsets
from rest_framework.response import Response
from knox.models import AuthToken
from rest_framework.parsers import MultiPartParser, FormParser
from .serializer import HomeProfileSerializer, ProfileSerializer, UserSerializer, RegisterSerializer, LoginSerializer, DocsSerializer
import random
from rest_framework import parsers
from  rest_framework.permissions import IsAuthenticated
from .models import AgentProfile, HomeProfile, Profile, User, Docs
from rest_framework.decorators import api_view, permission_classes
from django.core.mail import send_mail

# Register API
class RegisterAPI(generics.GenericAPIView):
  serializer_class = RegisterSerializer
  def post(self, request, *args, **kwargs):
    data = request.data
    email = data['email']
    password = data['password']
    print(data, "data")
    push_token = data['push_token']
    type = data['type']
    if type == "HOME":
      key = data['key']
      if key:
        serializer = self.get_serializer(data={
          "email":email,
          "password":password,
          "push_token":push_token
        }, context={'type':data['type']})
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        agent = AgentProfile.objects.get(key=key)
        if agent:
          profile = HomeProfile.objects.get(home=user)
          print(profile, "pro", key)
          profile.name = data['home_name']
          profile.address = data["address"]
          profile.agent.add(agent)
          
          profile.save()
        else:
          return Response({"message":"Agent not found"}, status=404)
    
    else:
      serializer = self.get_serializer(data={
      "email":email,
      "password":password,
      "push_token":push_token
      }, context={'type':data['type']})
      serializer.is_valid(raise_exception=True)
      user = serializer.save()
    
      
    if type == 'CARER':
      print("poooor", user)
      key = data["key"]
      agent = AgentProfile.objects.filter(key=key).first()
      carer = Profile.objects.get(user = user)
      carer.first_name = data['first_name']
      carer.last_name = data['last_name']
      if key and agent:
        carer.key = key
        carer.agent.add(agent)
      carer.save()
    elif type == 'AGENT':
      agent = AgentProfile.objects.get(agent=user)
      key = data["company"][:2] + str(random.randint(100, 999)) + str(user.id)
      agent.name = data["company"]
      agent.postcode = data["postcode"]
      agent.phone = data["phone"]
      agent.key = key
      agent.save()
    return Response({
      "user": UserSerializer(user, context=self.get_serializer_context()).data,
      "token": AuthToken.objects.create(user)[1],
      "message":"authorized"
    })

# Login API
class LoginAPI(generics.GenericAPIView):
  serializer_class = LoginSerializer

  def post(self, request, *args, **kwargs):
    print("mairuuu", request.data)
    serializer = self.get_serializer(data=request.data)
    print(serializer.is_valid(), "valid")
    serializer.is_valid(raise_exception=True)
    user = serializer.validated_data
    _, token = AuthToken.objects.create(user)
    
    return Response({
      "user": UserSerializer(user, context=self.get_serializer_context()).data,
      "token": token,
      "message":"authorized"
    })

# Get User API
@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def UserAPI(request, *args, **kwargs):
  user = request.user
  serializer = UserSerializer(user)
  _, token = AuthToken.objects.create(user)
  home_img_url = 'http://localhost:8000/media/care.jpg'
  return Response({
    "user":serializer.data,
    "token":token,
    "message":"authorized",
    home_img_url:home_img_url
  })

# class UserAPI(generics.RetrieveAPIView):

#   permission_classes = (
#     permissions.IsAuthenticated,
#   )
#   serializer_class = UserSerializer
#   def get_object(self):
#     _, token = AuthToken.objects.create(self.request.user)
#     return {
#       "user":self.request.user,
#       "token":token,
#       "message":"authorized"
#     }
@api_view(['GET'])
def getProfile(request, *args, **kwargs):
  id = request.GET['id']
  user = Profile.objects.get(id = id)
  return Response({
    "user":ProfileSerializer(user).data
  })

@api_view(["GET"])
def UserListView(request, *args, **kwargs):
  user = request.user
  type = request.GET.get('type')
  shift_id = request.GET['shift_id']
  agent = AgentProfile.objects.get(agent=user)
  if user.is_agent or user.is_staff:
    if(type == 'HOME'):
      agent = AgentProfile.objects.get(agent=user)
      serializer = HomeProfileSerializer(agent.homeprofile_set.all(), many=True)
      return Response(serializer.data, status=200)
    elif type == 'CARER':
      qs = Profile.objects.filter(user__carer = True).filter(key=agent.key)
      serializer = ProfileSerializer(qs, many=True, context={"shift_id":shift_id})
      return Response(serializer.data, 200)
    return Response({"message":'No users'}, status=404)
  return Response({"message":"Unauthorized"}, status=404)
    


@api_view(["POST"])
def invite_homes(request, *args, **kwargs):
  if request.method == "POST":
    agent = AgentProfile.objects.get(agent = request.user)
    # recip = request.POST['email']
    send_mail(
      f'{agent.name}-WYECARE',
      f'{agent.name} has invited you to join WyeCare, here is your agency {agent.key}',
      "anandhusathee@gmail.com",
      ["anandhuuhere@gmail.com"]
    )
    return Response({"message":"Success"}, status=201)

@api_view(["GET"])
def getDocs(request, *args, **kwargs):
  if(request.method == "GET"):
    id = request.GET["profile_id"]
    docs = Docs.objects.filter(profile__id=id)
    serializer = DocsSerializer(docs, many=True)
    return Response(serializer.data, status=200)


class DocUploadView(views.APIView):
  parser_class = (MultiPartParser, FormParser)
  def post(self, request, *args, **kwargs):
    print(request.data, "data", request.FILES)
    data = request.data
    file = data["file"]
    doc_key=data["key"]
    id = data["profile_id"]
    profile = Profile.objects.filter(id=id).first()
    if profile:
      doc = Docs.objects.create(profile=profile, key=doc_key, file=file)
      serializer = DocsSerializer(doc)
      return Response(serializer.data, status=201)
    else:
      return Response({"message":"Error"}, status=400)
    # serializer = DocsSerializer(data=request.data["file"])
    # if serializer.is_valid():
    #   serializer.save()
    #   return Response(serializer.data, status=201)
    # else:
    #   return Response(serializer.errors, status=400)

@api_view(["POST"])
def upload_trainings(request, *args, **kwargs):
  if(request.method == "POST"):
    pass