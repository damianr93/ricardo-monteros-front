import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../../store/store'
import { fetchSettings, updateSettings } from '../../../store/settings/thunks'

const SettingsForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const minOrderAmount = useSelector((state: RootState) => state.settings.minOrderAmount)

  const [value, setValue] = useState<string>('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    dispatch(fetchSettings())
  }, [dispatch])

  useEffect(() => {
    setValue(String(minOrderAmount ?? 0))
  }, [minOrderAmount])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = Number(value)
    if (Number.isNaN(parsed) || parsed < 0) return
    setSaving(true)
    try {
      await dispatch(updateSettings({ minOrderAmount: parsed }))
    } catch {
      // el thunk ya muestra el toast de error
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-lg">
      <h2 className="text-xl font-heading text-primary mb-2">Configuración de la tienda</h2>
      <p className="text-sm text-gray-500 mb-6">
        Definí el monto mínimo que debe alcanzar un pedido para poder enviarse.
        Poné <strong>0</strong> para no exigir un mínimo.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Monto mínimo de compra ($)
          </label>
          <input
            type="number"
            min={0}
            step="0.01"
            value={value}
            onChange={e => setValue(e.target.value.replace(/[^\d.]/g, ''))}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-primary text-secondary-lightest px-6 py-2 rounded-md hover:bg-primary-dark transition disabled:opacity-50"
        >
          {saving ? 'Guardando...' : 'Guardar'}
        </button>
      </form>
    </div>
  )
}

export default SettingsForm
