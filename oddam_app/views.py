from django.contrib.auth import authenticate, login, logout
from django.shortcuts import render, redirect
from django.views import View

from .models import Donation, Institution, CustomUser, Category


class LandingPageView(View):
    def get(self, request):
        bag_counter = 0
        institution_counter = 0
        fundacje = Institution.objects.filter(type='fundacja')
        organizacje = Institution.objects.filter(type='organizacja pozarządowa')
        zbiorki = Institution.objects.filter(type='zbiórka lokalna')
        donations = Donation.objects.all()
        institution_id_list = []
        counter_list = []
        for donation in donations:
            bag_counter += donation.quantity
            if donation.institution_id:
                institution_id_list.append(donation.institution_id)
        for _ in institution_id_list:
            if _ not in counter_list:
                institution_counter += 1
                counter_list.append(_)

        return render(request, 'index.html', {
            'bag_counter': bag_counter,
            'institution_counter': institution_counter,
            'fundacje': fundacje,
            'organizacje': organizacje,
            'zbiorki': zbiorki,
                                              })


class AddDonationView(View):
    def get(self, request):
        return render(request, 'form.html')


class LoginView(View):
    def get(self, request):
        return render(request, 'login.html')

    def post(self, request):
        user = authenticate(email=request.POST.get('email'), password=request.POST.get('password'))
        if user:
            login(request, user)
            return redirect('/')
        return redirect('register')


class RegisterView(View):
    def get(self, request):
        return render(request, 'register.html')

    def post(self, request):
        first_name = request.POST.get('name')
        last_name = request.POST.get('surname')
        email = request.POST.get('email')
        password = request.POST.get('password')
        password2 = request.POST.get('password2')
        CustomUser.objects.create_user(first_name=first_name, last_name=last_name, email=email, password=password, password2=password2)
        return redirect('login')


class FormView(View):
    def get(self, request):
        if request.user.is_authenticated:
            categories = Category.objects.all()
            institutions = Institution.objects.all()
            return render(request, 'form.html', {'categories': categories, 'institutions': institutions})
        else:
            return redirect('login')

    def post(self, request):
        bags = request.POST["bags"]
        address = request.POST["address"]
        phone = int(request.POST["phone"])
        city = request.POST["city"]
        postcode = request.POST["postcode"]
        date = request.POST["date"]
        time = request.POST["time"]
        more_info = request.POST["more_info"]
        institution_id = request.POST["institution_id"]
        categories_id = request.POST["categories_id"]
        donation = Donation.objects.create(
            quantity=bags,
            address=address,
            phone_number=phone,
            city=city,
            zip_code=postcode,
            pick_up_date=date,
            pick_up_time=time,
            pick_up_comment=more_info,
            institution_id=institution_id,
            user=request.user
        )
        categories = categories_id.split(',')
        for category in categories:
            donation.categories.add(Category.objects.get(pk=int(category)))
        return render(request, 'form-confirmation.html')


class LogoutView(View):
    def get(self, request):
        logout(request)
        return redirect('landing-page')


class ProfileView(View):
    def get(self, request):
        if request.user.is_authenticated:
            current_user = request.user
            return render(request, 'profile.html', {'current_user': current_user})
        return render(request, 'profile.html')


class UserDonationsView(View):
    def get(self, request):
        if request.user.is_authenticated:
            current_user = request.user
        return render(request, 'user-donations.html', {'current_user': current_user})
