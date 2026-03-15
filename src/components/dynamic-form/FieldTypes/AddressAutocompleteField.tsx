/**
 * AddressAutocompleteField Component
 *
 * Renders a CEP field with autocomplete (ViaCEP integration)
 */

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Loader2, Check } from 'lucide-react';
import { fetchAddressFromCEP } from '@/lib/formUtils';
import type { FormFieldProps } from '@/lib/supabase/formTypes';
import { getGridClasses } from '@/lib/formGridUtils';

interface ViaCEPAddress {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
}

export const AddressAutocompleteField = ({
  field,
  value,
  onChange,
  error,
  disabled = false,
}: FormFieldProps) => {
  const [loading, setLoading] = useState(false);
  const [fetched, setFetched] = useState(false);
  const [address, setAddress] = useState<ViaCEPAddress | null>(null);
  const gridClasses = getGridClasses(field.grid_columns, field.grid_md_columns);

  useEffect(() => {
    // Check if CEP value has 8 digits
    const cep = value?.replace(/\D/g, '');
    if (cep && cep.length === 8) {
      handleFetchCEP(cep);
    } else {
      setAddress(null);
      setFetched(false);
    }
  }, [value]);

  const handleFetchCEP = async (cep: string) => {
    setLoading(true);
    try {
      const data = await fetchAddressFromCEP(cep);
      if (data) {
        setAddress(data);
        setFetched(true);
        // Dispatch event so other fields can be updated
        window.dispatchEvent(
          new CustomEvent('cep-fetched', { detail: data })
        );
      }
    } catch (err) {
      console.error('Error fetching CEP:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only digits
    let cepValue = e.target.value.replace(/\D/g, '');
    // Format to 00000-000
    if (cepValue.length > 5) {
      cepValue = cepValue.slice(0, 5) + '-' + cepValue.slice(5, 8);
    }
    onChange(cepValue);
  };

  return (
    <div className={`form-field ${gridClasses}`}>
      <Label htmlFor={field.field_key} className="mb-2 block">
        {field.label}
        {field.is_required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      {field.help_text && (
        <p className="text-sm text-muted-foreground mb-2">
          {field.help_text}
        </p>
      )}
      <div className="relative">
        <Input
          id={field.field_key}
          type="text"
          placeholder={field.placeholder || '00000-000'}
          value={value || ''}
          onChange={handleChange}
          maxLength={9}
          disabled={disabled}
          className={`pr-10 ${error ? 'border-red-500' : ''}`}
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-gray-400" />
        )}
        {!loading && fetched && (
          <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
        )}
      </div>
      {address && (
        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
          <p className="font-medium text-green-800">Endereço encontrado:</p>
          <p className="text-green-700">
            {address.logradouro}, {address.bairro}, {address.localidade} -{' '}
            {address.uf}
          </p>
        </div>
      )}
      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  );
};
