'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/ui/button';
import { useState } from 'react';
import { useCreateContactUsRequest } from '@/lib/api/contact-us/create-contact-us-request';
import { Checkbox, CheckboxIndicator } from '@/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/ui/form';
import { Input } from '@/ui/input';
import { Textarea } from '@/ui/textarea';

const contactUsFormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email' }),
  message: z.string().min(1, { message: 'Message is required' }),
  checked: z
    .boolean()
    .refine((value) => value, 'You must agree to the terms and conditions'),
});
type ContactUsFormSchema = z.infer<typeof contactUsFormSchema>;

export const ContactUsForm = () => {
  const { createContactUsRequestAsync } = useCreateContactUsRequest();
  const [submitting, setSubmitting] = useState(false);
  const contactUsForm = useForm<ContactUsFormSchema>({
    resolver: zodResolver(contactUsFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
      checked: false,
    },
  });

  const onSubmit = async ({ message, name, email }: ContactUsFormSchema) => {
    try {
      setSubmitting(true);
      // 1) Отправляем на backend (сохранить заявку)
      await createContactUsRequestAsync({ name, email, message });
    } catch (e) {
      // ignore; перейдем к почтовому фоллбэку
    } finally {
      setSubmitting(false);
    }

    // 2) Фоллбэк: открываем письмо на marginespace@gmail.com
    if (typeof window !== 'undefined') {
      window.location.assign(
        `mailto:marginespace@gmail.com?subject=${encodeURIComponent(name)}&body=${encodeURIComponent(
          `From: ${email}\n\n${message}`,
        )}`,
      );
    }
  };

  return (
    <div className="border-primary flex w-full max-w-[620px] flex-col gap-4 rounded-[16px] border-2 bg-linear-white p-4 backdrop-blur-[35px] md:gap-[24px] md:p-[24px]">
      <div className="text-[20px] font-semibold md:text-[24px]">Contact us</div>
      <Form {...contactUsForm}>
        <form
          onSubmit={contactUsForm.handleSubmit(onSubmit)}
          className="flex flex-col gap-[16px]"
        >
          <FormField
            control={contactUsForm.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="w-full rounded-[8px] border-none bg-white/10 px-3 py-3 text-white placeholder:text-white/60 focus:bg-white/15 md:px-[14px] md:py-[13px]"
                    placeholder="Your name"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-white" />
              </FormItem>
            )}
          />
          <FormField
            control={contactUsForm.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="w-full rounded-[8px] border-none bg-white/10 px-3 py-3 text-white placeholder:text-white/60 focus:bg-white/15 md:px-[14px] md:py-[13px]"
                    placeholder="Email"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-white" />
              </FormItem>
            )}
          />
          <FormField
            control={contactUsForm.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    className="w-full min-h-[120px] rounded-[8px] border-none bg-white/10 px-3 py-3 text-white placeholder:text-white/60 focus:bg-white/15 md:min-h-[154px] md:px-[14px] md:py-[10px]"
                    placeholder="What we can help you with?"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-white" />
              </FormItem>
            )}
          />
          <FormField
            control={contactUsForm.control}
            name="checked"
            render={() => (
              <FormItem>
                <div className="flex items-center gap-[10px]">
                  <FormControl>
                    <Checkbox
                      className="flex min-h-[20px] min-w-[20px] items-center justify-center disabled:cursor-not-allowed"
                      onCheckedChange={(state) => {
                        const isChecked = state.valueOf().toString() === 'true';
                        contactUsForm.setValue('checked', isChecked);
                        if (isChecked) {
                          contactUsForm.clearErrors('checked');
                        }
                      }}
                    >
                      <CheckboxIndicator />
                    </Checkbox>
                  </FormControl>
                  <div className="m-0 text-[11px] leading-relaxed text-white/80 md:text-[12px]">
                    By submitting this form, I read the{' '}
                    <Link
                      href="/privacy-policy"
                      className="text-primary underline-offset-2 hover:underline"
                    >
                      Privacy Policy
                    </Link>{' '}
                    and agree with{' '}
                    <Link
                      href="/terms-and-conditions"
                      className="text-primary underline-offset-2 hover:underline"
                    >
                      Terms and Conditions
                    </Link>
                  </div>
                </div>
                <FormMessage className="text-white" />
              </FormItem>
            )}
          />
          <div className="mt-4 flex flex-col gap-4 md:mt-[16px] lg:flex-row lg:items-center lg:justify-end lg:gap-[24px]">
            <div className="block text-center text-[12px] font-medium text-white/80 lg:hidden">
              Ask our moderators and community on Discord
            </div>
            <div className="flex w-full items-center gap-[8px] lg:hidden">
              <div className="h-[1px] w-full bg-white/20" />
              <div className="text-[12px] font-medium text-white/60">or</div>
              <div className="h-[1px] w-full bg-white/20" />
            </div>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              className="h-full w-full px-6 py-3 md:px-[48px] md:py-[10px] lg:w-fit disabled:opacity-60"
            >
              {submitting ? 'Sending…' : 'Send Request'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
