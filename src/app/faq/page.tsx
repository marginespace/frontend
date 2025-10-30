import { Divider } from '@/components/earn/earn-details/common/Divider';
import { faqConfig } from '@/components/faq/config';
import { FaqDropdownItem } from '@/components/faq/faq-dropdown-item';
import { FaqList } from '@/components/faq/faq-list';

// Отключаем статическую генерацию для этой страницы
export const dynamic = 'force-dynamic';

const FAQ = () => {
  return (
    <main className="m-auto flex h-full max-w-[95%] flex-col gap-[24px] py-[40px] lg:max-w-[588px]">
      <div className="w-full text-center text-[24px] font-semibold leading-[32px] md:text-[32px] md:leading-[44px]">
        FAQ
      </div>
      <div className="flex w-full flex-col rounded-[16px] bg-transparent-bg p-4 backdrop-blur lg:bg-linear-white">
        {faqConfig.map((item, index) => (
          <>
            <FaqList
              key={item.title}
              title={item.title}
              items={item.items.map((el, i) => (
                <FaqDropdownItem
                  key={`${el.question}-${i}`}
                  question={el.question}
                  answer={el.answer}
                />
              ))}
            />
            {index < faqConfig.length - 1 && (
              <div className="w-full py-4">
                <Divider />
              </div>
            )}
          </>
        ))}
      </div>
    </main>
  );
};

export default FAQ;
