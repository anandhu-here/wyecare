
from rest_framework import serializers
from django.contrib.auth import authenticate

from .models import AgentProfile, HomeProfile, Profile, TrainingCertificates, User, Docs
from shift.models import ShiftAssignment
class AgentProfileSerializer(serializers.ModelSerializer):
  push_token = serializers.SerializerMethodField()
  class Meta:
    model = AgentProfile
    fields = ('agent', 'phone', 'key', 'name', 'postcode', 'address', 'push_token')

  def get_push_token(self, obj):
    if obj.agent.push_token:
      return obj.agent.push_token
    else:
      return False
class HomeProfileSerializer(serializers.ModelSerializer):
  agent = AgentProfileSerializer(read_only=True, many=True)
  class Meta:
    model = HomeProfile
    fields = ['address', 'id', 'home', 'name', 'postcode', 'agent']
  

class TrainingSerializer(serializers.ModelSerializer):
  class Meta:
    model = TrainingCertificates
    fields = "__all__"

class DocsSerializer(serializers.ModelSerializer):
  class Meta:
    model = Docs
    fields="__all__" 

class ProfileSerializer(serializers.ModelSerializer):
  position = serializers.SerializerMethodField()
  trainings = serializers.SerializerMethodField()
  ass_data = serializers.SerializerMethodField()
  push_token = serializers.SerializerMethodField()
  agent = serializers.SerializerMethodField()
  class Meta:
    model = Profile 
    fields = ['id', 'first_name', 'last_name', 'user', 'position', "trainings", "ass_data", "push_token", "agent"]
  def get_position(self, obj):
    return obj.get_pos
  def get_push_token(self, obj):
    return obj.user.push_token
  def get_agent(self, obj):
    agent = AgentProfile.objects.filter(key=obj.key).first()
    if agent:
      return AgentProfileSerializer(agent).data
    else: return False
  def get_ass_data(self, obj):
    context = self.context["shift_id"]
    
    if context:
      id = int(self.context["shift_id"])
      shiftAss = ShiftAssignment.objects.filter(shiftname_id=id).filter(employee_id=obj.id).first()
      if shiftAss and shiftAss.employee.id == obj.id:
        return {"selected":shiftAss.selected, "color":shiftAss.color, "ass_id":shiftAss.id}
      else:
        return {"selected":False, "color":False, "ass_id":False}
    else:
      pass
  # def get_color(self, obj):
  #   context = self.context["shift_id"]
  #   if context:
  #     id = int(self.context["shift_id"])
  #     shiftAss = ShiftAssignment.objects.filter(shiftname_id=id).filter(employee_id=obj.id).first()
  #     if shiftAss and shiftAss.employee.id == obj.id:
  #       return shiftAss.color 
  #     else:
  #       return False
  #   else:
  #     pass
  def get_trainings(self, obj):
    return TrainingSerializer(TrainingCertificates.objects.filter(profile=obj), many=True).data

# User Serializer
class UserSerializer(serializers.ModelSerializer):
  profile = serializers.SerializerMethodField(read_only = True)
  type = serializers.SerializerMethodField()
  class Meta:
    model = User
    fields = ('id', 'email', 'last_login', "first_login", "staff", "admin", "home", "carer", "nurse", "agent", "profile", "type", "push_token")
  def get_type(self, obj):
    if obj.home:
      return "HOME"
    elif obj.agent:
      return "AGENT"
    else:
      return "CARER"
  def get_profile(self, obj):
    if(obj.home):
      profile = HomeProfile.objects.get(home = obj)
      return HomeProfileSerializer(profile).data
    elif obj.agent:
      agent = AgentProfile.objects.get(agent = obj)
      return AgentProfileSerializer(agent).data
    else:
      user = Profile.objects.get(user = obj)
      print("mairu mairu")
      return ProfileSerializer(user, context={"shift_id":False}).data
# Register Serializer
class RegisterSerializer(serializers.ModelSerializer):
  type = serializers.SerializerMethodField()
  class Meta:
    model = User
    fields = ('id', 'email', 'password', 'type', 'push_token')
    extra_kwargs = {'password': {'write_only': True}}
  def create(self, validated_data):
    user_type = self.context['type']
    if user_type == "AGENT":
      user = User.objects.create_agent(**validated_data)
      return user
    if(user_type=='CARER'):
      user = User.objects.create_carer_user(**validated_data)
      return user
    elif(user_type=='HOME'):
      user = User.objects.create_home_user(**validated_data)
      return user
    return
# Login Serializer
class LoginSerializer(serializers.Serializer):
  email = serializers.CharField()
  password = serializers.CharField()
  def validate(self, data):
    try:
      user = User.objects.get(email=data['email'])
      print(user, "user")
    except User.DoesNotExist:
      raise serializers.ValidationError("Incorrect Credentials")
    user = authenticate(email=user.email, password=data['password'])
    print(user, "uuuuuuu")
    if user:
      return user
    raise serializers.ValidationError("Incorrect Credentials")


