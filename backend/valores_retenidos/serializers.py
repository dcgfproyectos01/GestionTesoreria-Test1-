from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
<<<<<<< HEAD
from .models import Funcionario, ReporteFuncionario, PeriodoRemuneracion, Estado, SeguimientoUsuario, Concepto, MotivoPago, Grado, PerfilUsuario


=======
from .models import Aplicacion, Funcionario, ReporteFuncionario, PeriodoRemuneracion, Estado, SeguimientoUsuario, Concepto, MotivoPago, Grado, PerfilUsuario, Rol





class AplicacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Aplicacion
        fields = ["id_aplicacion","nombre"]

# === Serializer específico para Perfilamiento ===
class FuncionarioPerfilSerializer(serializers.ModelSerializer):
    # IDs para relaciones (rol / grado) y nombres de solo lectura
    grado = serializers.PrimaryKeyRelatedField(
        queryset=Grado.objects.all(), required=False, allow_null=True
    )
    rol = serializers.PrimaryKeyRelatedField(
        queryset=Rol.objects.all(), required=False, allow_null=True
    )
    grado_nombre = serializers.CharField(source='grado.nombre_grado', read_only=True)
    rol_nombre   = serializers.CharField(source='rol.nombre_rol',   read_only=True)

    # dotación opcional (si no la envías desde el front)
    dotacion = serializers.CharField(required=False, allow_blank=True, default='')

    # Choices reales del modelo
    area_trabajo = serializers.ChoiceField(
        choices=Funcionario._meta.get_field('area_trabajo').choices
    )

    class Meta:
        model  = Funcionario
        fields = [
            'rut', 'nombre',
            'grado', 'grado_nombre',
            'dotacion',
            'rol', 'rol_nombre',
            'area_trabajo',
        ]

    # Normaliza RUT (sin puntos ni guion)
    def validate_rut(self, value: str) -> str:
        rut = (value or '').replace('.', '').replace('-', '').upper()
        if not rut:
            raise serializers.ValidationError('RUT requerido')
        if not (7 <= len(rut) <= 9):
            raise serializers.ValidationError('Formato de RUT inválido')
        return rut

    # POST: crea si no existe, o actualiza si ya existe (upsert)
    def create(self, validated_data):
        validated_data.setdefault('dotacion', '')  # <- default
        rut = validated_data['rut']
        obj, _created = Funcionario.objects.update_or_create(
            rut=rut,
            defaults=validated_data,
        )
        return obj

    # PATCH/PUT: actualiza normal
    def update(self, instance, validated_data):
        validated_data.setdefault('dotacion', '')  # <- default
        for k, v in validated_data.items():
            setattr(instance, k, v)
        instance.save()
        return instance

class RolSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rol
        fields = ["id_rol", "nombre_rol"]

>>>>>>> 8d61a77 (Actualización: se sube carpeta DesGestionTesoreria con los últimos cambios)
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
<<<<<<< HEAD
    grado_nombre = serializers.CharField(source='grado.nombre_grado', read_only=True)
    class Meta:
        model = Funcionario
        fields = ['rut', 'nombre', 'grado','grado_nombre']
=======
    #para llamar desde otra tabla, FK
    grado_nombre = serializers.CharField(source='grado.nombre_grado', read_only=True)
    rol_nombre =  serializers.CharField(source='rol.nombre_rol', read_only=True)
    
    class Meta:
        model = Funcionario
        fields = ['rut', 'nombre', 'grado','area_trabajo','rol','rol_nombre','grado_nombre']
>>>>>>> 8d61a77 (Actualización: se sube carpeta DesGestionTesoreria con los últimos cambios)

    def to_internal_value(self, data):
        rut = data.get('rut')
        if rut and Funcionario.objects.filter(rut=rut).exists():
            funcionario = Funcionario.objects.get(rut=rut)
            
            return {
                'rut': funcionario.rut,
                'nombre': data.get('nombre', funcionario.nombre),
                'grado': funcionario.grado.id_grado  # ← importante: retornar ID, no objeto
            }
        return super().to_internal_value(data)

#PERIODO REMUNERACION
class PeriodoRemuneracionSerializer(serializers.ModelSerializer):
    id_periodo_remuneracion = serializers.IntegerField(required=False)  # <- NUEVO
    motivo_pago_nombre = serializers.CharField(source='motivo_pago.nombre_motivo_pago', read_only=True)

    class Meta:
        model = PeriodoRemuneracion
        fields = ['id_periodo_remuneracion', 'periodo_remuneracion', 'motivo_pago', 'motivo_pago_nombre', 'monto']


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
            'observaciones_analisis',
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

        if isinstance(funcionario_data, dict):
            grado = funcionario_data.get('grado')
            if isinstance(grado, dict):
                grado = grado.get('id_grado')
            elif isinstance(grado, Grado):
                grado = grado.id_grado

            funcionario, _ = Funcionario.objects.get_or_create(
                rut=funcionario_data['rut'],
                defaults={
                    'nombre': funcionario_data['nombre'],
                    'grado_id': grado,
                    'dotacion': funcionario_data.get('dotacion', '')
                }
            )

        else:
            funcionario = funcionario_data  # ya viene como instancia

        # Obtener estado
        estado_pendiente = Estado.objects.filter(nombre__iexact='Pendiente').first()
        if not estado_pendiente:
            raise serializers.ValidationError("No existe el estado 'Pendiente' en la base de datos.")

        # Crear el ingreso
        ingreso = ReporteFuncionario.objects.create(
            funcionario=funcionario,
            estado_actual=estado_pendiente,
            **validated_data
        )

        # Crear periodos
        for periodo_data in periodos_data:
            PeriodoRemuneracion.objects.create(ingreso_funcionario=ingreso, **periodo_data)

        # Registrar seguimiento
        SeguimientoUsuario.objects.create(
            id_estado=estado_pendiente,
            id_reporte_funcionario=ingreso
        )

        return ingreso


    def update(self, instance, validated_data):
        funcionario_data = validated_data.pop('funcionario', None)
        periodos_data = validated_data.pop('periodos', [])

        # Actualizar funcionario
        if funcionario_data:
            func = instance.funcionario
            func.nombre = funcionario_data.get('nombre', func.nombre)
            grado = funcionario_data.get('grado')
        if grado:
            try:
                func.grado_id = int(grado)  # Convertimos siempre a entero, incluso si viene como string "13"
                func.save()
            except (ValueError, TypeError):
                raise serializers.ValidationError("El campo 'grado' debe ser un número entero válido.")


        # Actualizar campos simples
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # Actualizar periodos
        for periodo in periodos_data:
            periodo_id = periodo.pop('id_periodo_remuneracion', None)
            if periodo_id:
                # Update existente
                p = PeriodoRemuneracion.objects.get(id_periodo_remuneracion=periodo_id, ingreso_funcionario=instance)
                for k, v in periodo.items():
                    setattr(p, k, v)
                p.save()
            else:
                # Crear nuevo si no existe
                PeriodoRemuneracion.objects.create(ingreso_funcionario=instance, **periodo)

        return instance

#MOTIVO PAGO
class MotivoPagoSerializer(serializers.ModelSerializer):

    class Meta:
        model = MotivoPago
        fields = ['id_motivopago', 'nombre_motivo_pago']

#TOKEN LOGIN
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Intentar obtener el perfil
        perfil = PerfilUsuario.objects.select_related('funcionario__rol').filter(user=user).first()

        if perfil and perfil.funcionario:
            funcionario = perfil.funcionario
            token['rut'] = funcionario.rut
            token['nombre'] = funcionario.nombre
            token['rol'] = funcionario.rol.nombre_rol if funcionario.rol else ''
            token['area_trabajo'] = funcionario.area_trabajo or ''
        else:
            # Si no hay perfil asociado, dejar campos vacíos
            token['rut'] = ''
            token['nombre'] = ''
            token['rol'] = ''
            token['area_trabajo'] = ''

        return token

# PERFIL USUARIO
class PerfilUsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = PerfilUsuario
        fields = '__all__'
<<<<<<< HEAD
=======

# === Serializer específico para Perfilamiento ===
class FuncionarioPerfilSerializer(serializers.ModelSerializer):
    # IDs para relaciones (rol / grado) y nombres de solo lectura
    grado = serializers.PrimaryKeyRelatedField(
        queryset=Grado.objects.all(), required=False, allow_null=True
    )
    rol = serializers.PrimaryKeyRelatedField(
        queryset=Rol.objects.all(), required=False, allow_null=True
    )
    grado_nombre = serializers.CharField(source='grado.nombre_grado', read_only=True)
    rol_nombre   = serializers.CharField(source='rol.nombre_rol',   read_only=True)

    # dotación opcional (si no la envías desde el front)
    dotacion = serializers.CharField(required=False, allow_blank=True, default='')

    # Choices reales del modelo
    area_trabajo = serializers.ChoiceField(
        choices=Funcionario._meta.get_field('area_trabajo').choices
    )

    class Meta:
        model  = Funcionario
        fields = [
            'rut', 'nombre',
            'grado', 'grado_nombre',
            'dotacion',
            'rol', 'rol_nombre',
            'area_trabajo',
        ]

    # Normaliza RUT (sin puntos ni guion)
    def validate_rut(self, value: str) -> str:
        rut = (value or '').replace('.', '').replace('-', '').upper()
        if not rut:
            raise serializers.ValidationError('RUT requerido')
        if not (7 <= len(rut) <= 9):
            raise serializers.ValidationError('Formato de RUT inválido')
        return rut

    # POST: crea si no existe, o actualiza si ya existe (upsert)
    def create(self, validated_data):
        validated_data.setdefault('dotacion', '')  # <- default
        rut = validated_data['rut']
        obj, _created = Funcionario.objects.update_or_create(
            rut=rut,
            defaults=validated_data,
        )
        return obj

    # PATCH/PUT: actualiza normal
    def update(self, instance, validated_data):
        validated_data.setdefault('dotacion', '')  # <- default
        for k, v in validated_data.items():
            setattr(instance, k, v)
        instance.save()
        return instance

>>>>>>> 8d61a77 (Actualización: se sube carpeta DesGestionTesoreria con los últimos cambios)
