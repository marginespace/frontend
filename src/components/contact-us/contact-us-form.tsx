'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/ui/button';
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
  const contactUsForm = useForm<ContactUsFormSchema>({
    resolver: zodResolver(contactUsFormSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
      checked: false,
    },
  });

  const onSubmit = ({ message, name }: ContactUsFormSchema) => {
    if (typeof window !== 'undefined') {
      window.location.assign(
        `mailto:collaborate@cubera.finance?subject=${encodeURIComponent(
          name,
        )}&body=${encodeURIComponent(message)}`,
      );
    }
  };

  return (
    <div className="border-light-purple flex w-full max-w-[620px] flex-col gap-[24px] rounded-[16px] border-2 bg-linear-white p-[24px] backdrop-blur-[35px]">
      <div className="text-[24px] font-semibold">Contact us</div>
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
                    className="rounded-[8px] border-none bg-[#352852] bg-opacity-[0.43] px-[14px] py-[13px] placeholder:text-[#C6C6CC]"
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
                    className="rounded-[8px] border-none bg-[#352852] bg-opacity-[0.43] px-[14px] py-[13px] placeholder:text-[#C6C6CC]"
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
                    className="min-h-[154px] rounded-[8px] border-none bg-[#352852] bg-opacity-[0.43] px-[14px] py-[10px] placeholder:text-[#C6C6CC]"
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
                  <div className="m-0 text-[12px] text-[#F1F3F8]">
                    By submitting this form, I read the{' '}
                    <Link
                      href="/docs/privacy-policy.docx"
                      className="text-light-purple underline-offset-2 hover:underline"
                    >
                      Privacy Policy
                    </Link>{' '}
                    and agree with{' '}
                    <Link
                      href="/docs/terms-and-conditions.docx"
                      className="text-light-purple underline-offset-2 hover:underline"
                    >
                      Terms and Conditions
                    </Link>
                  </div>
                </div>
                <FormMessage className="text-white" />
              </FormItem>
            )}
          />
          <div className="mt-[16px] flex flex-col-reverse items-center justify-end gap-[24px] lg:flex-row">
            <div className="block self-start text-[12px] font-medium text-[#F1F3F8] lg:hidden">
              Ask our moderators and community on Discord:
            </div>
            <div className="flex w-full items-center gap-[8px] lg:hidden">
              <div className="h-[1px] w-full bg-[#CFC9FF]" />
              <div className="text-[12px] font-medium text-[#CFC9FF]">or</div>
              <div className="h-[1px] w-full  bg-[#CFC9FF]" />
            </div>
            <Button
              type="submit"
              variant="contained"
              className="h-full w-full px-[48px] py-[10px] lg:w-fit"
            >
              Send Request
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
