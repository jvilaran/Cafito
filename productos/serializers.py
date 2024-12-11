from rest_framework import serializers, viewsets
from .models import Producto, Venta, Usuario, DetalleVenta

class ProductoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Producto
        fields = '__all__'

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['username', 'password', 'email', 'role']
        extra_kwargs = {
            'password': {'write_only': True}  # Evita devolver la contraseña en la respuesta
        }

    def create(self, validated_data):
        # Crea el usuario y encripta la contraseña
        user = Usuario(
            username=validated_data['username'],
            email=validated_data['email'],
            role=validated_data['role']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class DetalleVentaSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source='producto.nombre')
    cantidad = serializers.IntegerField()
    precio = serializers.DecimalField(max_digits=10, decimal_places=2)
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2)
    class Meta:
        model = DetalleVenta
        fields = '__all__'

class VentaSerializer(serializers.ModelSerializer):
    nombre_producto = serializers.CharField(source="producto.nombre", read_only=True)
    detalles = DetalleVentaSerializer(many=True)

    class Meta:
        model = Venta
        fields = '__all__'

class VentaViewSet(viewsets.ModelViewSet):
    queryset = Venta.objects.all()
    serializer_class = VentaSerializer