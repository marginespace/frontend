import { ContactUsForm } from '@/components/contact-us/contact-us-form';
import { appName } from '@/constants/metadata';

// Отключаем статическую генерацию для этой страницы
export const dynamic = 'force-dynamic';

export const metadata = {
  title: `${appName}: Contact Us`,
};

// const data = [
//   {
//     title: 'Have Questions',
//     description:
//       '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod',
//     email: 'ouremailaddress@gmail.com',
//   },
//   {
//     title: 'Support',
//     description:
//       '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod',
//     email: 'ouremailaddress@gmail.com',
//   },
//   {
//     title: 'For Partners',
//     description:
//       '"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod',
//     email: 'ouremailaddress@gmail.com',
//   },
// ];
//
// const resources = [
//   {
//     text: 'Resource one',
//     href: '#',
//   },
//   {
//     text: 'Resource two',
//     href: '#',
//   },
//   {
//     text: 'Resource three',
//     href: '#',
//   },
//   {
//     text: 'Resource four',
//     href: '#',
//   },
//   {
//     text: 'Resource five',
//     href: '#',
//   },
//   {
//     text: 'Resource six',
//     href: '#',
//   },
// ];

const ContactUs = () => {
  return (
    <main className="container flex h-full min-w-full flex-col items-center gap-6 py-8 md:gap-[24px] md:py-[40px]">
      <div className="text-center text-[24px] font-semibold md:text-[32px]">Contact Us</div>
      <ContactUsForm />
      {/*<div className="flex w-full max-w-[620px] flex-col gap-[16px] rounded-[16px] border-2 border-light-purple bg-linear-white p-[16px] backdrop-blur-[35px]">*/}
      {/*  {data.map(({ title, description, email }) => (*/}
      {/*    <div*/}
      {/*      key={title}*/}
      {/*      className="flex flex-col gap-[8px] rounded-[16px] bg-white bg-opacity-[0.11] p-[16px]"*/}
      {/*    >*/}
      {/*      <div className="text-[20px] font-semibold">{title}</div>*/}
      {/*      <div className="text-[16px] font-medium">{description}</div>*/}
      {/*      <div className="flex items-center gap-[8px]">*/}
      {/*        <Email />*/}
      {/*        <Link*/}
      {/*          href={`mailto:${email}`}*/}
      {/*          className="text-[14px] underline-offset-4 hover:underline"*/}
      {/*        >*/}
      {/*          {email}*/}
      {/*        </Link>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  ))}*/}
      {/*  <div className="flex flex-col gap-[16px] rounded-[16px] bg-white bg-opacity-[0.11] p-[16px]">*/}
      {/*    <div className="text-[24px] font-semibold">Resources</div>*/}
      {/*    <div className="grid grid-cols-2 gap-x-[16px] gap-y-[8px] lg:grid-cols-3">*/}
      {/*      {resources.map(({ text, href }) => (*/}
      {/*        <div key={text} className="flex items-center gap-[8px]">*/}
      {/*          <Link*/}
      {/*            href={href}*/}
      {/*            target="_blank"*/}
      {/*            className="text-[14px] underline-offset-4 hover:underline"*/}
      {/*          >*/}
      {/*            {text}*/}
      {/*          </Link>*/}
      {/*          <OuterLink />*/}
      {/*        </div>*/}
      {/*      ))}*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}
    </main>
  );
};

export default ContactUs;
