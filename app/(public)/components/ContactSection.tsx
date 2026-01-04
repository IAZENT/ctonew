'use client'

import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { z } from 'zod'
import { Mail, MapPin, Phone, Clock } from 'lucide-react'

import { EASE_OUT } from '@/lib/animations/framer-utils'

type FormValues = {
  name: string
  email: string
  phone: string
  message: string
  productInterest: string
}

const schema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().min(7, 'Enter a valid phone number'),
  productInterest: z.string().min(1, 'Select a product interest'),
  message: z.string().min(10, 'Message should be at least 10 characters'),
})

type Field = keyof FormValues

type FieldErrorMap = Partial<Record<Field, string>>

function validate(values: FormValues): FieldErrorMap {
  const parsed = schema.safeParse(values)
  if (parsed.success) return {}

  const errors: FieldErrorMap = {}
  for (const issue of parsed.error.issues) {
    const key = issue.path[0] as Field | undefined
    if (key && !errors[key]) errors[key] = issue.message
  }
  return errors
}

function FloatingField(props: {
  id: Field
  label: string
  value: string
  onChange: (next: string) => void
  onTouched: () => void
  error?: string
  type?: string
  as?: 'input' | 'textarea'
}) {
  const { id, label, value, onChange, onTouched, error, type = 'text', as = 'input' } = props
  const [focused, setFocused] = React.useState(false)

  const float = focused || value.length > 0

  const Input = as

  return (
    <div className="relative">
      <Input
        id={id}
        name={id}
        value={value}
        onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => {
          setFocused(false)
          onTouched()
        }}
        type={as === 'input' ? type : undefined}
        rows={as === 'textarea' ? 4 : undefined}
        className={
          'w-full rounded-2xl border bg-background px-4 pb-3 pt-6 text-sm outline-none transition ' +
          (error ? 'border-red-500/60 ring-2 ring-red-500/15' : 'border-foreground/10 focus:border-primary')
        }
      />
      <motion.label
        htmlFor={id}
        className="pointer-events-none absolute left-4 top-4 origin-left text-sm text-foreground/70"
        animate={
          float
            ? { y: -10, scale: 0.85, opacity: 1 }
            : { y: 6, scale: 1, opacity: 0.7 }
        }
        transition={{ duration: 0.2, ease: EASE_OUT }}
      >
        {label}
      </motion.label>

      <AnimatePresence>
        {error ? (
          <motion.div
            key={error}
            className="mt-2 text-xs text-red-500"
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: [0, -3, 3, -2, 2, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: EASE_OUT }}
          >
            {error}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export function ContactSection() {
  const [values, setValues] = React.useState<FormValues>({
    name: '',
    email: '',
    phone: '',
    message: '',
    productInterest: '',
  })
  const [touched, setTouched] = React.useState<Partial<Record<Field, boolean>>>({})
  const [errors, setErrors] = React.useState<FieldErrorMap>({})
  const [submitting, setSubmitting] = React.useState(false)
  const [status, setStatus] = React.useState<'idle' | 'success' | 'error'>('idle')

  React.useEffect(() => {
    const nextErrors = validate(values)
    const visible: FieldErrorMap = {}

    ;(Object.keys(nextErrors) as Field[]).forEach((k) => {
      if (touched[k]) visible[k] = nextErrors[k]
    })

    setErrors(visible)
  }, [touched, values])

  const update = (key: Field, next: string) => {
    setValues((v) => ({ ...v, [key]: next }))
    setStatus('idle')
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const allTouched: Partial<Record<Field, boolean>> = {
      name: true,
      email: true,
      phone: true,
      message: true,
      productInterest: true,
    }
    setTouched(allTouched)

    const nextErrors = validate(values)
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors)
      setStatus('error')
      return
    }

    setSubmitting(true)
    setStatus('idle')

    await new Promise((r) => window.setTimeout(r, 900))

    setSubmitting(false)
    setStatus('success')
    setValues({ name: '', email: '', phone: '', message: '', productInterest: '' })
    setTouched({})
    setErrors({})
  }

  return (
    <section className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <h2 className="text-3xl font-semibold tracking-tight">Contact & inquiry</h2>
        <p className="mt-2 max-w-2xl text-sm text-foreground/70">
          Tell us about your space and we’ll recommend the right capacity, efficiency rating, and
          installation approach.
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-2">
          <form onSubmit={onSubmit} className="rounded-[2.5rem] border border-foreground/10 bg-card p-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <FloatingField
                id="name"
                label="Name"
                value={values.name}
                onChange={(v) => update('name', v)}
                onTouched={() => setTouched((t) => ({ ...t, name: true }))}
                error={errors.name}
              />
              <FloatingField
                id="email"
                label="Email"
                type="email"
                value={values.email}
                onChange={(v) => update('email', v)}
                onTouched={() => setTouched((t) => ({ ...t, email: true }))}
                error={errors.email}
              />
              <FloatingField
                id="phone"
                label="Phone"
                value={values.phone}
                onChange={(v) => update('phone', v)}
                onTouched={() => setTouched((t) => ({ ...t, phone: true }))}
                error={errors.phone}
              />
              <div className="relative">
                <select
                  id="productInterest"
                  value={values.productInterest}
                  onChange={(e) => update('productInterest', e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, productInterest: true }))}
                  className={
                    'h-14 w-full rounded-2xl border bg-background px-4 text-sm outline-none transition ' +
                    (errors.productInterest
                      ? 'border-red-500/60 ring-2 ring-red-500/15'
                      : 'border-foreground/10 focus:border-primary')
                  }
                >
                  <option value="">Product interest</option>
                  <option value="wall-mounted">Wall mounted</option>
                  <option value="ducted">Ducted systems</option>
                  <option value="portable">Portable units</option>
                  <option value="commercial">Commercial</option>
                </select>
                <AnimatePresence>
                  {errors.productInterest ? (
                    <motion.div
                      key={errors.productInterest}
                      className="mt-2 text-xs text-red-500"
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: [0, -3, 3, -2, 2, 0] }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35, ease: EASE_OUT }}
                    >
                      {errors.productInterest}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>

            <div className="mt-4">
              <FloatingField
                id="message"
                label="Message"
                as="textarea"
                value={values.message}
                onChange={(v) => update('message', v)}
                onTouched={() => setTouched((t) => ({ ...t, message: true }))}
                error={errors.message}
              />
            </div>

            <div className="mt-6 flex items-center gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex min-h-14 flex-1 items-center justify-center rounded-2xl bg-primary px-5 text-sm font-medium text-primary-foreground shadow-lg shadow-foreground/10 transition disabled:opacity-60"
              >
                {submitting ? 'Sending…' : 'Send inquiry'}
              </button>

              <button
                type="button"
                className="inline-flex min-h-14 items-center justify-center rounded-2xl bg-background px-5 text-sm font-medium ring-1 ring-foreground/10 transition hover:bg-foreground/5"
                onClick={() => {
                  setValues({ name: '', email: '', phone: '', message: '', productInterest: '' })
                  setTouched({})
                  setErrors({})
                  setStatus('idle')
                }}
              >
                Reset
              </button>
            </div>

            <AnimatePresence>
              {status === 'success' ? (
                <motion.div
                  className="mt-4 rounded-2xl bg-accent/10 px-4 py-3 text-sm text-foreground"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.25, ease: EASE_OUT }}
                >
                  Thanks — your message is ready for Phase 3 submission handling.
                </motion.div>
              ) : null}
            </AnimatePresence>
          </form>

          <div className="rounded-[2.5rem] border border-foreground/10 bg-card p-6">
            <div className="aspect-[16/10] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-primary/15 via-background to-accent/15 ring-1 ring-foreground/10">
              <div className="flex h-full items-center justify-center text-sm text-foreground/70">
                Map placeholder (Phase 3)
              </div>
            </div>

            <dl className="mt-6 grid gap-4 text-sm">
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 text-primary" aria-hidden />
                <div>
                  <dt className="font-semibold">Email</dt>
                  <dd className="text-foreground/70">support@aircon.example</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 text-primary" aria-hidden />
                <div>
                  <dt className="font-semibold">Phone</dt>
                  <dd className="text-foreground/70">+1 (555) 012-3456</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-primary" aria-hidden />
                <div>
                  <dt className="font-semibold">Address</dt>
                  <dd className="text-foreground/70">100 Cooling Avenue, Suite 12</dd>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 text-primary" aria-hidden />
                <div>
                  <dt className="font-semibold">Hours</dt>
                  <dd className="text-foreground/70">Mon–Fri, 9am–6pm</dd>
                </div>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}
