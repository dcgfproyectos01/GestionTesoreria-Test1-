from rest_framework import serializers
from .models import Funcionario, ReporteFuncionario, PeriodoRemuneracion, Estado, SeguimientoUsuario, Concepto, MotivoPago, Grado


#CONCEPTO 
class ConceptoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Concepto
        fields = ['id_concepto', 'nombre_concepto']

#GRADO
class GradoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Grado
        fields = ['id_grado', 'nombre_grado']

#FUNCIONARIO
class FuncionarioSerializer(serializers.ModelSerializer):
    grado_nombre = serializers.CharField(source='grado.nombre_grado', read_only=True)
    class Meta:
        model = Funcionario
        fields = ['rut', 'nombre', 'grado','grado_nombre']

    def to_internal_value(self, data):
        rut = data.get('rut')
        if rut and Funcionario.objects.filter(rut=rut).exists():
            funcionario = Funcionario.objects.get(rut=rut)
            
            return {
                'rut': funcionario.rut,
                'nombre': data.get('nombre', funcionario.nombre),
                'grado': funcionario.grado.id  # ← importante: retornar ID, no objeto
            }
        return super().to_internal_value(data)

#PERIODO REMUNERACION
class PeriodoRemuneracionSerializer(serializers.ModelSerializer):
    motivo_pago_nombre = serializers.CharField(source='motivo_pago.nombre_motivo_pago', read_only=True)

    class Meta:
        model = PeriodoRemuneracion
        fields = ['periodo_remuneracion', 'motivo_pago', 'motivo_pago_nombre', 'monto']

#REPORTE FUNCINOARIO
class ReporteFuncionarioSerializer(serializers.ModelSerializer):
    funcionario = FuncionarioSerializer()
    periodos = PeriodoRemuneracionSerializer(many=True)
    estado_nombre = serializers.CharField(source='estado_actual.nombre', read_only=True)
    concepto_nombre = serializers.CharField(source='concepto.nombre_concepto', read_only=True)

    class Meta:
        model = ReporteFuncionario
        fields = [
            'id_reporte_funcionario',
            'fecha_creacion',
            'funcionario',
            'concepto',              # viene como id
            'concepto_nombre',       # nombre para mostrar
            'ncu_doe',
            'motivo_bloqueo',
            'observaciones',
            'estado_actual',         # viene como id
            'estado_nombre',         # nombre para mostrar
            'nro_comprobante_contable',
            'observaciones_contabilidad',
            'nro_nomina_pago',
            'observaciones_pago',
            'periodos'
        ]

    def create(self, validated_data):
        funcionario_data = validated_data.pop('funcionario')
        periodos_data = validated_data.pop('periodos')

        funcionario, _ = Funcionario.objects.get_or_create(
            rut=funcionario_data['rut'],
            defaults={
                'nombre': funcionario_data['nombre'],
                'grado': funcionario_data['grado'],
                'dotacion': funcionario_data.get('dotacion', '')
            }
        )

        estado_pendiente = Estado.objects.filter(nombre__iexact='Pendiente').first()
        if not estado_pendiente:
            raise serializers.ValidationError("No existe el estado 'Pendiente' en la base de datos.")

        ingreso = ReporteFuncionario.objects.create(
            funcionario=funcionario,
            estado_actual=estado_pendiente,
            **validated_data
        )

        for periodo_data in periodos_data:
            PeriodoRemuneracion.objects.create(ingreso_funcionario=ingreso, **periodo_data)

        SeguimientoUsuario.objects.create(
            id_estado=estado_pendiente,
            id_reporte_funcionario=ingreso
        )

        return ingreso

#MOTIVO PAGO
class MotivoPagoSerializer(serializers.ModelSerializer):
    class Meta:
        model = MotivoPago
        fields = ['id_motivopago', 'nombre_motivo_pago']