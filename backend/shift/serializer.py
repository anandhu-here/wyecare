
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
    class Meta:
        model = ShiftName
        fields = ('id', 'longday', 'night', 'late', 'early', 'home', 'day', 'month', 'year', 'home_id', "assigned","covered" )
    def get_home(self, instance):
        return instance.get_home_data
    def get_home_id(self, instance):
        return instance.get_home_id
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
    shiftname = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = ShiftAssignment
        fields = ('id', 'type', 'employee', 'shiftname')
    def get_shiftname(self, ins):
        return ShiftSerializer(ins.shiftname, context={"employee_id":ins.employee.id}).data
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
    class Meta:
        model = Notifications
        fields = ('id', 'home', "shift", "dealt", "type", "date_added", "employee", "shift_ass_id")
    def get_home(self, obj):
        return obj.get_home_data
    def get_employee(self, obj):
        if self.context:
            id = self.context["employee_id"]
            return Profile.objects.get(id = id)
        else: return False
    def get_shift_ass_id(self, obj):
        if self.context:
            id = self.context["shift_ass_id"]
            return ShiftAssignment.objects.get(id = id)
        else:
            return False
class ShiftAssignSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShiftAssignment
        fields = "__all__"
        