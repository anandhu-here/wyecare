from rest_framework import generics, permissions, views, viewsets
from rest_framework.response import Response
from accounts.models import AgentProfile, Profile, User
from .models import  Notifications, ShiftAssignment, ShiftName, Timesheets
from accounts.models import HomeProfile
import requests as rq
from .serializer import NotificationSerializer, ShiftAssignSerializer, ShiftAssignmentSerializer, ShiftSerializer, ShiftAssignedSerializer, TimesheetSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.parsers import MultiPartParser, FormParser
import base64
from django.core.files.base import ContentFile

from operator import attrgetter
from itertools import chain

class Publish(generics.GenericAPIView):
    serializer_class = ShiftSerializer
    def post(self, request, *args, **kwargs):
        data = request.data['shift']
        home_id = data['home_id']
        agent_id = data['agent_id']
        day = data['day']
        month = data['month']
        year = data['year']
        longday = data['longday']
        night = data['night']
        late = data['late']
        early = data['early']
        home = HomeProfile.objects.filter(id = home_id)[0]
        agent = AgentProfile.objects.get(agent =  User.objects.get(id=agent_id))
        shift = ShiftName.objects.create(home=home, day=day, agent=agent, month=month, year=year, night=night, late=late, early=early, longday=longday)
        serializer = self.get_serializer(shift, many=False)
        return Response(serializer.data, status=201)
    
class PublishBulk(generics.GenericAPIView):
    serializer_class = ShiftSerializer
    def post(self, request, *args, **kwargs):
        home_id = request.data['shift'][0]['home_id']
        agent_id = request.data['shift'][0]['agent_id']
        home = HomeProfile.objects.filter(id = home_id)[0]
        agent = AgentProfile.objects.get(id = agent_id)
        data = request.data['shift']
        shifts = [ShiftName(home=home,agent=AgentProfile.objects.filter(id=shift['agent_id']).first(), day = shift['day'], month = shift['month'], longday = shift['longday'], night=shift['night'], early=shift['early'], late=shift['late'], year = shift['year']) for shift in data]
        shifts_final = ShiftName.objects.bulk_create(shifts)
        serializer = self.get_serializer(shifts_final, many=True)
        Notifications.objects.create(home = home, body="Shifts has been added", dealt=False, type=0)
        return Response(serializer.data)

class ShiftListApi(generics.GenericAPIView):
    # serializer_class = ShiftSerializer
    def get(self, request, *args, **kwargs):
        month = request.GET['month']
        user = request.user
        if(user.is_agent):
            agent = AgentProfile.objects.get(agent=user)
            shifts = ShiftName.objects.filter(month=month).filter(agent=agent)
            return Response(ShiftSerializer(shifts, many=True, context={"employee_id":False}).data, status=200)
        elif user.is_home:
            home = HomeProfile.objects.get(home=user)
            
            shifts = ShiftName.objects.filter(month=month).filter(home=home)
            print(shifts, "shifts")
            return Response(ShiftSerializer(shifts, many=True, context={"employee_id":False}).data, status=200)   

class AssignedList(generics.ListAPIView):
    serializer_class = ShiftAssignedSerializer
    def get_queryset(self):
        id = self.request.GET['employee_id']
        qs = ShiftAssignment.objects.filter(employee__id=id)
        print(qs, "qs")
        return qs

class GetSpecificAss(generics.GenericAPIView):
    def get(self, request, *args, **kwargs):
        pass

class NotificationListApi(generics.GenericAPIView):
    def get(self, request, *args, **kwargs):
        data = request.GET
        not_type = data["type"]
        print(not_type, "b")
        if not_type == "homea":
            qs1 = Notifications.objects.all().order_by("-date_added")
        elif not_type == "home":
            qs1 = Notifications.objects.filter(type=2).order_by("-date_added")
        return Response(NotificationSerializer(qs1, many=True, context={"employee_id":False, "shift_ass_id":False}).data, status=200)
        

class TimesheetList(generics.ListAPIView):
    serializer_class = TimesheetSerializer
    def get_queryset(self):
        id = self.request.GET["id"]
        qs = Timesheets.objects.filter(profile__id=id)
        return qs




class AssignShift(generics.GenericAPIView):
    serializer_class = ShiftAssignmentSerializer
    # def get_serializer_context(self):
    #     context = super(AssignShift, self).get_serializer_context()
    #     context.update({"shift_id":assigned_shift[0]['shift_id']})
    #     return context
    def post(self, request, *args, **kwargs):
        # shift_id = request.data['id']
        # user_id = request.data['user_id']
        # home_id = request.data['home_id']
        assigned_shift = request.data['assigned']
        print(assigned_shift, "assigned")
        qs_ass = ShiftAssignment.objects.filter(shiftname_id=assigned_shift[0]["shift_id"])
        final = []
        for shift in assigned_shift:
            ass = ShiftAssignment(type=shift["ass_data"]['selected'], shiftname = ShiftName.objects.get(id = shift['shift_id']), selected = shift["ass_data"]["selected"], color=shift["ass_data"]["color"], employee = Profile.objects.get(id=shift['id']))
            if len(qs_ass) > 0:
                for ass2 in qs_ass:
                    if ass.employee.id != ass2.employee.id and ass.shiftname.id == ass2.shiftname.id:
                        final.append(ass)
            else:
                final.append(ass)
        assigned_final = ShiftAssignment.objects.bulk_create(final)

        serializer = self.get_serializer(assigned_final, context={"shift_id":assigned_shift[0]['shift_id']}, many=True)

        return Response(serializer.data)

@api_view(["POST"])
def replaceAssigned(request, *args, **kwargs):
    if request.method == "POST":
        re_id = request.data["re_id"]
        ass = ShiftAssignment.objects.get(id=re_id)
        ass.delete()
        return Response({"message":"Deleted"}, status=200)

@api_view(["POST"])
def CancelRequest(request, *args, **kwargs):
    if request.method == "POST":
        data = request.data
        shift_id = data["shift_id"]
        employee_id = data["employee_id"]
        emp = Profile.objects.get(id = employee_id)
        shift_ass_id = data["shift_ass_id"]
        ass = ShiftAssignment.objects.get(id=shift_ass_id)
        shift = ShiftName.objects.get(id=shift_id)
        noti = Notifications.objects.get_or_create(shift=shift, type=1, body=data["body"],dealt=False, employee=emp, shift_ass=ass)
        return Response(NotificationSerializer(noti, context={"employee_id":employee_id, "shift_ass_id":shift_ass_id}).data, status=200)

@api_view(["POST"])
def WriteTimesheet(request, *args, **kwargs):
  if request.method == "POST":
    data = request.data
    profile = Profile.objects.get(id=data['profile_id'])
    home = HomeProfile.objects.get(id=data['home_id'])
    shiftname = ShiftName.objects.get(id=data['shift_id'])
    shift_ass = ShiftAssignment.objects.filter(shiftname=shiftname).filter(employee=profile).first()
    img_data = data["image"]
    format, imgstr = img_data.split(';base64,')
    ext = format.split('/')[-1]
    imgdata = ContentFile(base64.b64decode(imgstr))
    filename = "signature." + ext
    sheet = Timesheets(profile=profile, type=data["type"], home=home,shiftname=shiftname, auth_name=data["auth_name"], auth_position=data["auth_position"])
    sheet.sign.save(filename, imgdata, save=True)
    shift_ass.covered = True
    shift_ass.save()
    sheet.save()
    serializer = TimesheetSerializer(sheet)
    return Response(serializer.data, status=200)


# class WriteTimesheet(generics.GenericAPIView):
#     parser_classes = ( MultiPartParser, FormParser )
#     serializer_class = TimesheetSerializer
#     def post(self, request, *args, **kwargs):
#         image = 

class RejectCarer(generics.GenericAPIView):
    serializer_class = ShiftSerializer
    def post(self, request, *args, **kwargs):
        data = request.data
        shift_id = data['shift_id']
        id = data['id']
        shift = ShiftName.objects.get(id=id)
        print(shift, "kk")
        try:
            ass_shift = ShiftAssignment.objects.get(id=shift_id)
            ass_shift.delete()
            serializer = self.get_serializer(shift, many=False)
            return Response({'message':"Rejected", "data":serializer.data}, status=200)
        except:
            return Response({'message':"Couldn't reject the carer"}, status=400)

