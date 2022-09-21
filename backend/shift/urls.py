from django.urls import path

from .api import AssignShift, CancelRequest, NotificationListApi, Publish, PublishBulk, RejectCarer, ShiftListApi, AssignedList, TimesheetList, WriteTimesheet, get_anal_res, get_in_data, replaceAssigned

urlpatterns = [
    path('shift-publish', Publish.as_view() ),
    path('shift-bulk-publish', PublishBulk.as_view()),
    path('list-assigned', AssignedList.as_view()),
    path('assign-shift', AssignShift.as_view()),
    path('shifts', ShiftListApi.as_view()),
    path('notify', NotificationListApi.as_view()),
    path('reject', RejectCarer.as_view()),
    path('write-timesheet', WriteTimesheet),
    path('get-timesheets', TimesheetList.as_view()),
    path('cancel-request', CancelRequest ),
    path('replace', replaceAssigned),
    path('get-in', get_in_data),
    path('get-anal', get_anal_res)
]