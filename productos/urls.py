from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProductoViewSet, CrearVentaView, ListarVentasView, DetalleVentaView, FiltrarVentasPorFechaView, CrearUsuarioView, LoginView, ListarUsuariosView, EliminarUsuarioView, UsuarioActualView

router = DefaultRouter()
router.register(r'productos', ProductoViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('login/', LoginView.as_view(), name='login'),
    path('register/', CrearUsuarioView.as_view(), name='register'),
    path('usuarios/', ListarUsuariosView.as_view(), name='usuarios'),
    path('usuario/actual/', UsuarioActualView.as_view(), name='usuario_actual'),
    path('usuarios/<int:usuario_id>/', EliminarUsuarioView.as_view(), name='eliminar_usuario'),
    path('ventas/listar/', ListarVentasView.as_view(), name='listar-ventas'),
    path('ventas/filtrar/', FiltrarVentasPorFechaView.as_view(), name='filtrar-ventas'),
    path('ventas/nueva/', CrearVentaView.as_view(), name='nueva-venta'),
    path('ventas/<int:id>/', DetalleVentaView.as_view(), name='detalle_venta'),

]
