import json
from django.shortcuts import render
from .models import Order, OrderItem
from django.core.mail import send_mail

def index(request):
    return render(request, 'index.html')


def main(request):
    return render(request, 'main.html')


def breakfast(request):
    return render(request, 'breakfast.html')


def salads(request):
    return render(request, 'salads.html')


def checkout(request):
    # أسعار الباقات
    price_map = {2: 1296, 3: 1673, 4: 2169, 5: 2546}

    if request.method == "POST":
        name = request.POST.get("name")
        phone = request.POST.get("phone")
        email = request.POST.get("email")
        address = request.POST.get("address")
        notes = request.POST.get("notes")

        cart_data = request.POST.get("cart_data")

        try:
            cart_items = json.loads(cart_data)
        except:
            cart_items = []

        if not cart_items:
            return render(request, "checkout.html", {
                "error": "🚨 Your cart is empty."
            })

        # ==============================
        # حساب إجمالي عدد الوجبات
        # ==============================
        total_qty = sum(item.get("quantity", 0) for item in cart_items)

        if total_qty < 2:
            return render(request, "checkout.html", {
                "error": "🚨 You must order at least 2 meals in total."
            })

        # ==============================
        # دالة تقسيم المجموعات
        # ==============================
        def split_groups(n):
            groups = []
            while n > 0:
                if n >= 5:
                    groups.append(5)
                    n -= 5
                elif n == 4:
                    groups.append(4)
                    n -= 4
                elif n == 3:
                    groups.append(3)
                    n -= 3
                elif n == 2:
                    groups.append(2)
                    n -= 2
                elif n == 1:
                    # نضم الواحدة لأي باقة
                    groups.append(2)
                    n -= 1
            return groups

        groups = split_groups(total_qty)

        # ==============================
        # حساب الإجمالي النهائي
        # ==============================
        grand_total = 0
        for g in groups:
            grand_total += price_map.get(g, price_map[5])

        # نخلي سعر كل عنصر 0 (لأن الحساب كلي)
        for item in cart_items:
            item["price"] = 0

        # ==============================
        # إنشاء الأوردر
        # ==============================
        order = Order.objects.create(
            name=name,
            phone=phone,
            email=email,
            address=address,
            notes=notes,
            total=grand_total
        )

        # إنشاء العناصر داخل الأوردر
        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                meal_name=item["name"],
                quantity=item["quantity"],
                price=0
            )

        # ==============================
        # تجهيز تفاصيل الإيميل
        # ==============================
        order_details = ""
        for item in cart_items:
            order_details += f"{item['name']} x {item['quantity']}\n"

        message = f"""
New Order Received!

Name: {name}
Phone: {phone}
Email: {email}
Address: {address}
Notes: {notes}

Total Meals: {total_qty}
Total Price: {grand_total} AED

Order Details:
{order_details}
"""

        send_mail(
            subject=f"New Order from {name}",
            message=message,
            from_email='caloriesfix198@gmail.com',
            recipient_list=['caloriesfix198@gmail.com'],
        )

        return render(request, "checkout_success.html", {
            "order": order,
            "clear_cart": True
        })

    return render(request, "checkout.html")


def order_success(request):
    return render(request, "checkout_success.html", {
        "order": {
            "name": "Test User",
            "total": 123.45
        }
    })
def menu(request):
    return render(request, 'menu.html')