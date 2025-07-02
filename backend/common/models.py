from django.db import models

# --------------------------
# MODELO: Grado
# --------------------------
class Grado(models.Model):
    id_grado = models.AutoField(primary_key=True)
    nombre_grado = models.CharField(max_length=50)

    def __str__(self):
        return self.nombre_grado


# --------------------------
# MODELO: Rol
# --------------------------
class Rol(models.Model):
    id_rol = models.AutoField(primary_key=True)
    nombre_rol = models.CharField(max_length=50)

    def __str__(self):
        return self.nombre_rol


# --------------------------
# MODELO: Funcionario
# --------------------------
class Funcionario(models.Model):
    rut = models.CharField(max_length=9, primary_key=True)
    nombre = models.CharField(max_length=100)
    grado = models.ForeignKey(Grado, on_delete=models.PROTECT, related_name='funcionarios')
    dotacion = models.CharField(max_length=50)
    rol = models.ForeignKey(Rol, on_delete=models.PROTECT, related_name='funcionarios', null=True, blank=True)  # Nuevo
    area_trabajo = models.CharField(
        max_length=50,
        choices=[
            ('ANALISIS', 'Área de Análisis'),
            ('CONTABILIDAD', 'Área de Contabilidad'),
            ('PAGO', 'Área de Pago')
        ],
    	null=True,
    	blank=True
    )

    def __str__(self):
        return f"{self.rut} - {self.nombre}"


# --------------------------
# MODELO: Estado
# --------------------------
class Estado(models.Model):
    id_estado = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)

    def __str__(self):
        return self.nombre


# --------------------------
# MODELO: Concepto
# --------------------------
class Concepto(models.Model):
    id_concepto = models.AutoField(primary_key=True)
    nombre_concepto = models.CharField(max_length=50)

    def __str__(self):
        return self.nombre_concepto


# --------------------------
# MODELO: ReporteFuncionario
# --------------------------
class ReporteFuncionario(models.Model):
    id_reporte_funcionario = models.AutoField(primary_key=True)
    funcionario = models.ForeignKey(Funcionario, on_delete=models.CASCADE, related_name='reportes')
    fecha_creacion = models.DateField(auto_now_add=True)
    concepto = models.ForeignKey(Concepto, on_delete=models.PROTECT, related_name='reportes')
    ncu_doe = models.IntegerField()
    motivo_bloqueo = models.CharField(max_length=50)
    observaciones_analisis = models.TextField(blank=True, null=True)
    estado_actual = models.ForeignKey(Estado, on_delete=models.PROTECT, null=True, blank=True)

    # CONTABILIDAD
    nro_comprobante_contable = models.CharField(max_length=50, blank=True, null=True)
    observaciones_contabilidad = models.TextField(blank=True, null=True)

    # PAGO
    nro_nomina_pago = models.CharField(max_length=50, blank=True, null=True)
    observaciones_pago = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Reporte de {self.funcionario.nombre} ({self.funcionario.rut}) - {self.fecha_creacion}"


# --------------------------
# MODELO: MotivoPago
# --------------------------
class MotivoPago(models.Model):
    id_motivopago = models.AutoField(primary_key=True)
    nombre_motivo_pago = models.CharField(max_length=50)

    def __str__(self):
        return self.nombre_motivo_pago


# --------------------------
# MODELO: SeguimientoUsuario
# --------------------------
class SeguimientoUsuario(models.Model):
    id_seguimiento_usuario = models.AutoField(primary_key=True)
    id_estado = models.ForeignKey(Estado, on_delete=models.PROTECT)
    id_reporte_funcionario = models.ForeignKey(ReporteFuncionario, on_delete=models.CASCADE, related_name='seguimientos')
    usuario = models.ForeignKey(Funcionario, on_delete=models.PROTECT, related_name='acciones', null=True, blank=True)
    fecha_seguimiento = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Seguimiento #{self.id_seguimiento_usuario} - {self.id_estado.nombre} por {self.usuario.rut}"



# --------------------------
# MODELO: PeriodoRemuneracion
# --------------------------
class PeriodoRemuneracion(models.Model):
    id_periodo_remuneracion = models.AutoField(primary_key=True)
    ingreso_funcionario = models.ForeignKey(ReporteFuncionario, on_delete=models.CASCADE, related_name='periodos')
    periodo_remuneracion = models.DateField()
    motivo_pago = models.ForeignKey(MotivoPago, on_delete=models.PROTECT)
    monto = models.FloatField()

    def __str__(self):
        return f"{self.periodo_remuneracion.strftime('%m/%Y')} - ${self.monto:,.0f}"
