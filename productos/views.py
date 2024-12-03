from rest_framework import views, status, viewsets
from .models import Producto, Venta
from .serializers import ProductoSerializer, VentaSerializer
from rest_framework.response import Response
from decimal import Decimal

class CrearVentaView(views.APIView):
    def post(self, request):
        print("Datos recibidos", request.data)
        # Obtener el producto relacionado con el ID recibido en el request
        producto_id = request.data.get("producto")
        try:
            producto = Producto.objects.get(id=producto_id)
            print("Producto encontrado", producto)
        except Producto.DoesNotExist:
            return Response({"error": "Producto no encontrado"}, status=status.HTTP_400_BAD_REQUEST)

        # Verificar que el producto tiene un precio asignado
        if producto.precio is None:
            return Response({"error": "El producto no tiene un precio válido"}, status=status.HTTP_400_BAD_REQUEST)

        # Obtener la cantidad del producto
        cantidad = int(request.data.get("cantidad", 1))

        # Calcular el total sin propina
        precio = producto.precio or 0  # Si el precio es None, se usa 0
        total = precio * cantidad
        
        # Procesar la propina si se envía
        propina = Decimal(request.data.get("propina", 0))
        total_con_propina = total + propina
        
        if "total_con_propina" in request.data:
            total_con_propina = Decimal(request.data["total_con_propina"])

        # Crear el diccionario con los datos de la venta
        venta_data = {
            "producto": producto.id,
            "cantidad": cantidad,
            "precio": precio,
            "total": total_con_propina,
            "propina": propina,
        }
        
        # Serializar la venta
        serializer = VentaSerializer(data=venta_data)
        if serializer.is_valid():
            venta = serializer.save()
            return Response({"numero_factura": venta.numero_factura}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Vista para ver todas las ventas
class ListarVentasView(views.APIView):
    def get(self, request):
        ventas = Venta.objects.all()
        serializer = VentaSerializer(ventas, many=True)
        return Response(serializer.data)

# Vista para filtrar ventas por fecha
class FiltrarVentasPorFechaView(views.APIView):
    def get(self, request):
        fecha_inicio = request.query_params.get('inicio')
        fecha_fin = request.query_params.get('fin')
        
        # Filtramos las ventas en base a las fechas proporcionadas
        ventas = Venta.objects.filter(fecha__range=[fecha_inicio, fecha_fin])
        serializer = VentaSerializer(ventas, many=True)
        return Response(serializer.data)

# ViewSet para manejar productos
class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
