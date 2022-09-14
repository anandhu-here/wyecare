
from multiprocessing import context
from rest_framework import serializers

from accounts.models import HomeProfile, Profile
from accounts.serializer import HomeProfileSerializer, ProfileSerializer
from .models import Notifications, ShiftAssignment, ShiftName, Timesheets

class ShiftSerializer(serializers.ModelSerializer):
    home = serializers.SerializerMethodField()
    assigned = serializers.SerializerMethodField()
    home_id = serializers.SerializerMethodField()
    covered = serializers.SerializerMethodField()
    agency_token = serializers.SerializerMethodField()

    class Meta:
        model = ShiftName
        fields = ('id', 'longday', 'night', 'late', 'early', 'home', 'day', 'month', 'year', 'home_id', "assigned","covered", "agency_token")
    def get_home(self, instance):
        return instance.get_home_data
    def get_home_id(self, instance):
        return instance.get_home_id
    def get_agency_token(self, obj):
        return obj.agent.agent.push_token
    def get_covered(self, obj):
        for ass in obj.shiftassignment_set.all():
            return ass.covered
            
        #     id = self.context["employee_id"]
        #     t_sheet = Timesheets.objects.filter(profile__id=id).filter(shiftname=obj).first()
        #     if t_sheet:
        #         return True
        #     else:
        #         return False 
        # else:
        #     return False
    def get_assigned(self, instance):
        data = ShiftAssSerializer(ShiftAssignment.objects.filter(shiftname = instance), many=True, context={"shift_id":instance.id}).data
        return data

class TimesheetSerializer(serializers.ModelSerializer):
    profile = serializers.SerializerMethodField(read_only=True)
    shiftname = serializers.SerializerMethodField(read_only=True)
    home = serializers.SerializerMethodField(read_only=True)

    agency = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Timesheets
        fields = ('id', 'profile', 'shiftname', 'home', 'type','sign', 'auth_name', 'auth_position', 'agency' )

    def get_profile(self, obj):
        return ProfileSerializer(obj.profile, context={"shift_id":False}).data
    def get_shiftname(self, obj):
        return ShiftSerializer(obj.shiftname).data
    def get_home(self, obj):
        return ShiftSerializer(obj.shiftname).data
    def get_agency(self, obj):
        return False

    


class ShiftAssSerializer(serializers.ModelSerializer):
    employee = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = ShiftAssignment
        fields = ('id', 'type', 'employee', 'shiftname')
    def get_employee(self, ins):
        id = ins.employee.id
        pro = Profile.objects.get(id = id)
        return ProfileSerializer(pro, context={"shift_id":self.context["shift_id"]}).data

class ShiftAssignedSerializer(serializers.ModelSerializer):
    employee = serializers.SerializerMethodField(read_only=True)
    shiftdetail = serializers.SerializerMethodField(read_only=True)
    covered = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = ShiftAssignment
        fields = ('id', 'type', 'employee', 'shiftname', 'shiftdetail', 'covered')
    def get_shiftdetail(self, ins):
        return {"day":ins.shiftname.day, "month":ins.shiftname.month,"month":ins.shiftname.month, "home":ins.shiftname.home.name, "home_id":ins.shiftname.home.id}
    def get_covered(self, ins):
        return ins.covered
    def get_employee(self, ins):
        
        id = ins.employee.id
        pro = Profile.objects.get(id = id)
        return ProfileSerializer(pro, context={"shift_id":False}).data


class ShiftAssignmentSerializer(serializers.ModelSerializer):
    employee = serializers.SerializerMethodField(read_only=True)
    shiftname =serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = ShiftAssignment
        fields = ('id', 'type', 'employee', 'shiftname')

    def get_shiftname(self, obj):
        shift = ShiftName.objects.get(id=obj.shiftname.id)
        return ShiftSerializer(shift, context={"employee_id":False}).data
    def get_employee(self, ins):
        id = ins.employee.id
        pro = Profile.objects.get(id = id)
        return ProfileSerializer(pro, context={"shift_id":self.context["shift_id"]}).data




class NotificationSerializer(serializers.ModelSerializer):
    home = serializers.SerializerMethodField()
    employee = serializers.SerializerMethodField()
    shift_ass_id = serializers.SerializerMethodField()
    shift = serializers.SerializerMethodField()
    class Meta:
        model = Notifications
        fields = ('id', 'home', "shift","body", "dealt", "type", "date_added", "employee", "shift_ass_id")
    def get_home(self, obj):
        return obj.get_home_data
    def get_employee(self, obj):
        if self.context["employee_id"]:
            id = self.context["employee_id"]
            return id
        else: 
            if obj.employee:
                return obj.employee.id
            else: return False
    def get_shift(self, obj):
        if obj.shift:
            shift = ShiftName.objects.get(id=obj.shift.id)
            return ShiftSerializer(shift, context={"employee_id":False}).data
        return False
class ShiftAssignSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShiftAssignment
        fields = "__all__"
        