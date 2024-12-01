from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductoViewSet, CrearVentaView, ListarVentasView, FiltrarVentasPorFechaView

router = DefaultRouter()
router.register(r'productos', ProductoViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('ventas/listar/', ListarVentasView.as_view(), name='listar-ventas'),
    path('ventas/filtrar/', FiltrarVentasPorFechaView.as_view(), name='filtrar-ventas'),
    path('ventas/nueva/', CrearVentaView.as_view(), name='nueva-venta'),

]
