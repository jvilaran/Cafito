from django.contrib.auth.models import AbstractUser
from django.db import models
from decimal import Decimal


class Producto(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField()

    def __str__(self):
        return self.nombre

class Usuario(AbstractUser):
    ADMIN = 'admin'
    OPERARIO = 'operario'
    ROLES = [
        (ADMIN, 'Administrador'),
        (OPERARIO, 'Operario'),
    ]
    
    role = models.CharField(
        max_length=10,
        choices=ROLES,
        default=OPERARIO
    )
    groups = models.ManyToManyField(
        'auth.Group',
        related_name='usuario_set',
        blank=True
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='usuario_permissions_set',
        blank=True
    )
    
class Venta(models.Model):
    numero_factura = models.PositiveIntegerField(unique=True, blank=True, null=True)
    fecha = models.DateTimeField(auto_now_add=True)
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    propina = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    def save(self, *args, **kwargs):
        # Generar un número de factura único
        if not self.numero_factura:
            ultimo_numero = Venta.objects.aggregate(models.Max('numero_factura'))['numero_factura__max'] or 0
            self.numero_factura = ultimo_numero + 1
        super().save(*args, **kwargs)

    def calcular_total(self):
        """
        Calcula el total de la venta sumando los subtotales de los productos.
        """
        total = sum(detalle.subtotal for detalle in self.detalles.all())
        if self.propina:
            total += Decimal(self.propina)
        self.total = total
        self.save()

    def __str__(self):
        return f"Factura {self.numero_factura}"


class DetalleVenta(models.Model):
    venta = models.ForeignKey(Venta, on_delete=models.CASCADE, related_name="detalles")
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    cantidad = models.PositiveIntegerField()
    precio = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)

    def save(self, *args, **kwargs):
        # Calcular el subtotal basado en el precio y la cantidad
        self.subtotal = self.precio * self.cantidad
        super().save(*args, **kwargs)
