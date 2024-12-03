from rest_framework import serializers
from .models import Producto, Venta

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'

class VentaSerializer(serializers.ModelSerializer):
    nombre_producto = serializers.CharField(source="producto.nombre", read_only=True)

    class Meta:
        model = Venta
        fields = '__all__'