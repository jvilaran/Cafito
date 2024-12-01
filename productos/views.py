# views.py
from rest_framework import serializers, views, status, viewsets
from .models import Producto, Venta
from .serializers import ProductoSerializer
from rest_framework.response import Response

# Serializer para las ventas
class VentaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Venta
        fields = '__all__'

# Vista para crear una venta
class CrearVentaView(views.APIView):
    def post(self, request):
        serializer = VentaSerializer(data=request.data)
        if serializer.is_valid():
            precio = request.data["precio"]
            cantidad = request.data["cantidad"]
            propina = request.data.get("propina", 0)
            total = precio * cantidad
            total_con_propina = total + propina

            # Crear la venta
            venta = serializer.save(total=total, total_con_propina=total_con_propina)
            
            return Response(venta, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        return Response({"message": "Endpoint para registrar ventas. Use POST para crear una nueva venta."})


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
