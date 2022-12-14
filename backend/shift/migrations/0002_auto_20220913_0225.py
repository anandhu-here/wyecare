# Generated by Django 3.2 on 2022-09-13 02:25

import datetime
from django.db import migrations, models
import django.db.models.deletion
from django.utils.timezone import utc


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_auto_20220913_0225'),
        ('shift', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='notifications',
            name='body',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='notifications',
            name='dealt',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='notifications',
            name='employee',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='accounts.profile'),
        ),
        migrations.AddField(
            model_name='notifications',
            name='shift_ass',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='shift.shiftassignment'),
        ),
        migrations.AddField(
            model_name='notifications',
            name='type',
            field=models.CharField(choices=[(0, 'SHIFT_ADD'), (1, 'CANCEL_SHIFT'), (2, 'SHIFT_ASSIGN')], default=datetime.datetime(2022, 9, 13, 2, 25, 43, 545684, tzinfo=utc), max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='shiftassignment',
            name='covered',
            field=models.BooleanField(default=False),
        ),
        migrations.CreateModel(
            name='HomeNotifications',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('body', models.TextField(blank=True, null=True)),
                ('dealt', models.BooleanField(default=False)),
                ('date_added', models.DateTimeField(auto_now=True)),
                ('home', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accounts.homeprofile')),
            ],
        ),
    ]
