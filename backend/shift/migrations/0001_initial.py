# Generated by Django 3.2 on 2022-08-30 13:40

from django.db import migrations, models
import django.db.models.deletion
import shift.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Date',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('date', models.DateField(null=True)),
                ('dayofweek', models.IntegerField(blank=True, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='ShiftName',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('longday', models.IntegerField(blank=True, default=0, null=True)),
                ('night', models.IntegerField(blank=True, default=0, null=True)),
                ('late', models.IntegerField(blank=True, default=0, null=True)),
                ('early', models.IntegerField(blank=True, default=0, null=True)),
                ('day', models.CharField(blank=True, max_length=2, null=True)),
                ('month', models.CharField(blank=True, max_length=2, null=True)),
                ('year', models.IntegerField(blank=True, null=True)),
                ('agent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accounts.agentprofile')),
                ('home', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accounts.homeprofile')),
            ],
        ),
        migrations.CreateModel(
            name='Timesheets',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('timestamp', models.DateTimeField(auto_now_add=True)),
                ('type', models.CharField(choices=[('LATE', 'LATE'), ('LONGDAY', 'LONGDAY'), ('NIGHT', 'NIGHT'), ('EARLY', 'EARLY')], max_length=100)),
                ('sign', models.ImageField(blank=True, null=True, upload_to=shift.models.imageUpload)),
                ('auth_name', models.CharField(blank=True, max_length=200, null=True)),
                ('auth_position', models.CharField(blank=True, max_length=100, null=True)),
                ('home', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accounts.homeprofile')),
                ('profile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accounts.profile')),
                ('shiftname', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='shift.shiftname')),
            ],
        ),
        migrations.CreateModel(
            name='ShiftAssignment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(choices=[('LATE', 'LATE'), ('LONGDAY', 'LONGDAY'), ('NIGHT', 'NIGHT'), ('EARLY', 'EARLY')], max_length=100)),
                ('selected', models.CharField(blank=True, choices=[('LATE', 'LATE'), ('LONGDAY', 'LONGDAY'), ('NIGHT', 'NIGHT'), ('EARLY', 'EARLY')], max_length=100, null=True)),
                ('color', models.CharField(blank=True, max_length=100, null=True)),
                ('employee', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='profiles', to='accounts.profile')),
                ('shiftname', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='shift.shiftname')),
            ],
        ),
        migrations.CreateModel(
            name='Notifications',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date_added', models.DateTimeField(auto_now=True)),
                ('shift', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='shift.shiftname')),
            ],
        ),
        migrations.CreateModel(
            name='Employee',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('profile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accounts.profile')),
            ],
        ),
    ]
