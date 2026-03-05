# Contexto do Projeto

Este é um projeto de **Landing Page com Sistema de Agendamento Dinâmico** desenvolvido com React + TypeScript e Supabase.

## Minha Especialidade

Sou um **especialista em desenvolvimento de aplicações web modernas** com foco em:
- React 18+ com TypeScript
- Supabase (Database, Auth, Storage)
- Shadcn/ui + Radix UI
- React Hook Form + Zod
- TanStack Query
- Tailwind CSS

## Stack Tecnológico

### Core
- **React 18.3.1** com TypeScript
- **Vite** (porta 8080)
- **React Router DOM** para rotas

### UI & Styling
- **Shadcn/ui** baseado em Radix UI (48+ componentes em `src/components/ui/`)
- **Tailwind CSS** com dark mode
- **Lucide React** para ícones
- **Sonner** para toasts/notificações

### Forms & Validação
- **React Hook Form** com **Zod** para validação
- Sistema de formulários dinâmicos configurável via banco

### Backend
- **Supabase** (PostgreSQL + Auth + Storage)
- **TanStack Query** para data fetching e cache

### Utilidades
- **date-fns** com locale pt-BR
- **Class Variance Authority (CVA)** para variantes

---

## Estrutura do Projeto

```
src/
├── pages/                    # Páginas principais
│   ├── Index.tsx           # Landing page
│   ├── Agendamento.tsx     # Sistema de agendamento multi-step
│   └── NotFound.tsx
├── components/
│   ├── ui/                 # Componentes Shadcn/ui (NÃO modificar sem motivo)
│   ├── agendamento/        # Componentes do sistema de agendamento
│   └── [outros].tsx        # Componentes da landing page
├── lib/
│   ├── supabase/
│   │   ├── client.ts      # Cliente Supabase singleton
│   │   └── types.ts       # Tipos TypeScript do banco
│   └── utils.ts           # Funções utilitárias (cn, etc.)
├── services/
│   └── base.service.ts    # Camada de serviços para Supabase
└── hooks/
    ├── useFormConfig.ts
    ├── useLocalStorage.ts
    └── useLocalStorageForm.ts
```

---

## Padrões de Código

### Componentes React

**Sempre seguir:**
- TypeScript com interfaces para props
- Forward ref para componentes interativos (Button, Input, etc.)
- CVA (Class Variance Authority) para variantes
- `cn()` utility para mesclar classes Tailwind

```tsx
// ✅ Padrão correto
import { cn } from "@/lib/utils";
import * as React from "react";

interface MyComponentProps {
  className?: string;
  variant?: "default" | "outline";
}

export const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  ({ className, variant = "default", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("base-classes", className)}
        {...props}
      />
    );
  }
);
MyComponent.displayName = "MyComponent";
```

### Nomenclatura

- **PascalCase**: Componentes, Types, Interfaces
- **camelCase**: Variáveis, funções, hooks
- **snake_case**: Tabelas e colunas do banco
- **Prefixo `use`**: Custom hooks

### Hooks Personalizados

**Hooks disponíveis:**
- `useFormConfig` - Gerencia configurações de formulário dinâmico
- `useLocalStorage` - Persistência no browser
- `useLocalStorageForm` - Formulários com persistência

```tsx
// Padrão de localStorage
const [selection, setSelection] = useLocalStorage<ServiceSelection>(
  "agendamento-selection",
  { stateCode: null, serviceSlug: null }
);
```

---

## Integração Supabase

### Cliente

```tsx
import { supabase } from "@/lib/supabase/client";

// Singleton pattern - NÃO criar novas instâncias
```

### Services Layer

**Sempre usar a camada de services** em `src/services/base.service.ts`:

```typescript
// ✅ Correto
import { statsService } from "@/services/base.service";
const result = await statsService.getStats();

// ❌ Errado - Não chamar supabase diretamente nos componentes
const { data } = await supabase.from('stats').select('*');
```

### Padrões de Service

- Retornar `ApiResponse<T>` para consistência
- Usar cache de 5 min para configurações
- Tratamento de erro centralizado
- Funções `handleError` para toast de erro

---

## Formulários Dinâmicos

### Schema do Banco

O sistema usa configurações dinâmicas armazenadas no Supabase:

- `form_configurations` - Configuração por estado/serviço
- `form_sections` - Seções do formulário
- `form_fields` - Campos dinâmicos
- `field_options` - Opções para select/radio
- `field_validations` - Regras de validação
- `conditional_fields` - Lógica condicional

### Componentes de Formulário

Localização: `src/components/agendamento/`

- `DynamicField.tsx` - Renderiza campos dinâmicos
- `DynamicFormSection.tsx` - Renderiza seções
- `StepIndicator.tsx` - Indicador de progresso
- Steps específicos (SelecaoServico, DadosTitular, etc.)

### Grid System

Campos suportam grid responsivo (1-12 colunas):
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
```

---

## Error Handling

### Padrão

```tsx
import { toast } from "sonner";
import { handleError } from "@/services/base.service";

try {
  // código
} catch (error) {
  handleError(error);
  // ou
  toast.error("Mensagem específica");
}
```

### ApiResponse

```typescript
interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}
```

---

## Convenções Específicas

### NEVER

- ❌ Modificar componentes em `src/components/ui/` (Shadcn/ui) sem motivo crítico
- ❌ Criar novas instâncias do cliente Supabase
- ❌ Usar supabase diretamente em componentes (usar services)
- ❌ Desabilitar TypeScript em arquivos novos
- ❌ Usar `any` sem motivo extremamente justificado
- ❌ Fazer commits sem testar

### ALWAYS

- ✅ Usar TypeScript strict mode para novos arquivos
- ✅ Criar services para novas operações de Supabase
- ✅ Usar componentes Shadcn/ui quando disponíveis
- ✅ Seguir padrão de nomenclatura estabelecido
- ✅ Persistir dados de formulário com localStorage
- ✅ Adicionar toasts para feedback de sucesso/erro
- ✅ Usar `cn()` para classes condicionais
- ✅ Testar multi-step flow antes de considerar completo

### Before Writing Code

1. **Verificar se já existe**: Sempre procurar por funções/componentes similares antes de criar novos
2. **Reusar components UI**: Shadcn/ui tem 48+ componentes - use-os!
3. **Seguir o padrão**: Se o projeto usa X, use X (não introduza Y sem motivo)
4. **Type First**: Defina tipos/interfaces antes de implementar

---

## Tipos de Campos Suportados

- `text` - Input de texto padrão
- `email` - Input de email
- `tel` - Input de telefone
- `select` - Dropdown com opções
- `radio` - Radio buttons
- `checkbox` - Checkbox único
- `date` - Seleção de data
- `file` - Upload de arquivos (ex: PDF)
- `textarea` - Texto longo

---

##

Estrutura atual do banco esta no arquivo `estruturadobancoatual.sql`

## Locale

- **Português (pt-BR)** é o idioma principal
- Formatação de datas: `date-fns` com locale pt-BR
- Todas as mensagens em português

---

## Variáveis de Ambiente

```env
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

---

## URLs Importantes

- **Dev Server**: http://localhost:8080
- **Supabase Dashboard**: https://supabase.com/dashboard

---

## Última Atualização

Data: 2026-03-04
Contexto: Sistema de agendamento multi-step com formulários dinâmicos configuráveis via Supabase.
