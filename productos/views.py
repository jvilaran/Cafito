from django.contrib.auth import authenticate
from django.shortcuts import get_object_or_404
from django.utils.dateparse import parse_datetime
from rest_framework import views, status, viewsets, permissions
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from .models import Producto, Venta, Usuario, DetalleVenta
from .serializers import ProductoSerializer, UsuarioSerializer, VentaSerializer 
from decimal import Decimal

class CrearUsuarioView(views.APIView):
    def post(self, request):
        print("Datos recibidos:", request.data)
        serializer = UsuarioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()  # Guarda el nuevo usuario
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class EliminarUsuarioView(views.APIView):
    def delete(self, request, usuario_id):
        """
        Elimina un usuario específico por su ID.
        """
        # Buscar al usuario por su ID
        usuario = get_object_or_404(Usuario, id=usuario_id)

        # Eliminar el usuario
        usuario.delete()
        
        return Response({"message": f"Usuario con ID {usuario_id} eliminado exitosamente."}, status=status.HTTP_200_OK)

class LoginView(views.APIView):
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        # Autentica al usuario
        user = authenticate(request, username=username, password=password)
        if user is not None:
            # Genera el token JWT
            refresh = RefreshToken.for_user(user)
            return Response({
                "refresh": str(refresh),
                "access": str(refresh.access_token),
                "username": user.username,
            })
        return Response({"detail": "Credenciales incorrectas"}, status=status.HTTP_401_UNAUTHORIZED)

class ListarUsuariosView(views.APIView):
    permission_classes = [AllowAny]  # Permite el acceso a todos sin autenticación

    def get(self, request):
        # Obtener todos los usuarios desde la base de datos
        usuarios = Usuario.objects.all()
        
        # Serializar los usuarios
        serializer = UsuarioSerializer(usuarios, many=True)
        
        # Devolver la lista de usuarios
        return Response(serializer.data, status=status.HTTP_200_OK)

class UsuarioActualView(views.APIView):
    permission_classes = [IsAuthenticated]  # Requiere autenticación

    def get(self, request):
        # Serializar los datos del usuario actual
        serializer = UsuarioSerializer(request.user)
        return Response(serializer.data)
    
class ProductosView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        if request.user.role == 'operario':
            # Permite solo ver productos sin editar
            return Response({'mensaje': 'Solo lectura de productos'})
        elif request.user.role == 'admin':
            # Permite ver, editar, y eliminar productos
            return Response({'mensaje': 'Acceso completo a productos'})
        return Response({'mensaje': 'Acceso denegado'}, status=403)


    
class CrearVentaView(views.APIView):
    def post(self, request):
        datos = request.data
        print("Datos recibidos:", datos)  # Debug
        
        productos = datos.get("productos", [])
        propina = Decimal(datos.get("propina", 0))
        
        if not productos:
            return Response({"error": "Debe incluir al menos un producto en la venta."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Crear la venta
        venta = Venta.objects.create(propina=propina)

        for producto_data in productos:
            producto_id = producto_data.get("producto_id")
            cantidad = producto_data.get("cantidad", 1)

            # Debug
            print(f"Procesando producto ID {producto_id} con cantidad {cantidad}")

            if not producto_id or not isinstance(cantidad, int):
                return Response({"error": "El formato de productos es incorrecto."}, status=status.HTTP_400_BAD_REQUEST)

            try:
                producto = Producto.objects.get(id=producto_id)
            except Producto.DoesNotExist:
                return Response({"error": f"Producto con ID {producto_id} no encontrado."}, status=status.HTTP_400_BAD_REQUEST)

            # Verificar stock
            if producto.stock < cantidad:
                return Response({"error": f"No hay suficiente stock para {producto.nombre}."}, status=status.HTTP_400_BAD_REQUEST)

            # Reducir stock
            producto.stock -= cantidad
            producto.save()

            # Crear el detalle de la venta
            DetalleVenta.objects.create(
                venta=venta,
                producto=producto,
                cantidad=cantidad,
                precio=producto.precio,
            )

        # Calcular el total de la venta
        venta.calcular_total()

        return Response({"numero_factura": venta.numero_factura}, status=status.HTTP_201_CREATED)

class DetalleVentaView(views.APIView):
    def get(self, request, id):
        try:
            venta = Venta.objects.get(numero_factura=id)
            serializer = VentaSerializer(venta)
            return Response(serializer.data)
        except Venta.DoesNotExist:
            return Response({"error": "Venta no encontrada."}, status=status.HTTP_404_NOT_FOUND)

# Vista para ver todas las ventas
class ListarVentasView(views.APIView):
    def get(self, request):
        ventas = Venta.objects.prefetch_related('detalles').all()
        serializer = VentaSerializer(ventas, many=True)
        return Response(serializer.data)

# Vista para filtrar ventas por fecha
class FiltrarVentasPorFechaView(views.APIView):
    def get(self, request):
        fecha_inicio = request.query_params.get('inicio')
        fecha_fin = request.query_params.get('fin')

        if not fecha_inicio or not fecha_fin:
            return Response({"error": "Debe proporcionar las fechas 'inicio' y 'fin'."}, status=400)
        
        try:
            fecha_inicio = parse_datetime(fecha_inicio)
            fecha_fin = parse_datetime(fecha_fin)
        except ValueError:
            return Response({"error": "Formato de fecha no válido. Use 'YYYY-MM-DD HH:MM:SS'."}, status=400)

        # Filtrar ventas por rango de fechas
        ventas = Venta.objects.filter(fecha__range=[fecha_inicio, fecha_fin]).prefetch_related('detalles')
        serializer = VentaSerializer(ventas, many=True)
        return Response(serializer.data)

# ViewSet para manejar productos
class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer