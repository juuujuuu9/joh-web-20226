import * as React from "react"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldContent,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function ContactForm() {
  const [status, setStatus] = React.useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = React.useState<string>('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const body = Object.fromEntries(formData)

    setStatus('sending')
    setErrorMessage('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (!res.ok) {
        setErrorMessage(data.error || 'Failed to send')
        setStatus('error')
        return
      }
      setStatus('success')
      form.reset()
    } catch {
      setErrorMessage('Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="name" className="text-base">Name</FieldLabel>
          <FieldContent>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="Your name"
              required
              className="h-9 md:h-10 text-base md:text-base"
            />
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel htmlFor="email" className="text-base">Email</FieldLabel>
          <FieldContent>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className="h-9 md:h-10 text-base md:text-base"
            />
          </FieldContent>
        </Field>
        <Field>
          <FieldLabel htmlFor="message" className="text-base">Message</FieldLabel>
          <FieldContent>
            <Textarea
              id="message"
              name="message"
              placeholder="How can I help?"
              rows={5}
              required
              className="min-h-32 text-base md:text-base"
            />
          </FieldContent>
        </Field>
      </FieldGroup>
      <div className="mt-8 flex flex-col gap-3">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="inline-block rounded-md bg-primary-black px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-primary-black/90 disabled:opacity-70 dark:bg-white dark:text-primary-black dark:hover:bg-white/90"
        >
          {status === 'sending' ? 'Sending…' : 'Send message'}
        </button>
        {status === 'success' && (
          <p className="text-base text-green-600 dark:text-green-400">Message sent! I'll get back to you soon.</p>
        )}
        {status === 'error' && (
          <p className="text-base text-red-600 dark:text-red-400">{errorMessage || 'Something went wrong. Please try again.'}</p>
        )}
      </div>
    </form>
  )
}
