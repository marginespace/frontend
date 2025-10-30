import { appName } from '@/constants/metadata';

export const metadata = {
  title: `${appName}: Cookie Policy`,
};

const CookiePolicy = () => {
  return (
    <main className="flex h-full w-full flex-col items-center px-4 py-8 md:px-[16px] md:py-[40px]">
      <div className="w-full max-w-4xl">
        <h1 className="mb-8 text-center text-[28px] font-semibold text-white md:text-[36px]">
          Cookie Policy
        </h1>

        <div className="rounded-[16px] border-2 border-primary/30 bg-linear-white p-6 backdrop-blur-[35px] md:p-8">
          <div className="prose prose-invert max-w-none">
            <p className="mb-6 text-sm text-white/80 md:text-base">
              <strong>Effective as of August 01, 2025</strong>
            </p>

            <p className="mb-4 text-sm leading-relaxed text-white/90 md:text-base">
              The website https://marginspace.com and other related pages (the "Website") are
              operated by Margin Space (the "Platform", "we" or "us"). Margin Space is a
              decentralized finance (DeFi) protocol that operates on blockchain networks. By using
              this Website you consent to us using cookies and your personal data in the ways
              described below and in the Privacy Policy and give your acceptance of both.
            </p>

            <p className="mb-6 text-sm leading-relaxed text-white/90 md:text-base">
              Your privacy is very important for Margin Space. This is the Cookie Policy of Margin
              Space's Website which provides detailed information about how and when we use cookies.
              All personal information obtained by Margin Space on or through its Website is
              processed in accordance with the relevant data protection laws and our Privacy Policy.
              Here you can find our{' '}
              <a href="/privacy-policy" className="text-primary underline-offset-2 hover:underline">
                Privacy Policy
              </a>
              .
            </p>

            <section className="mb-8">
              <h2 className="mb-4 text-xl font-semibold text-white md:text-2xl">
                What are cookies?
              </h2>
              <p className="mb-4 text-sm leading-relaxed text-white/90 md:text-base">
                Upon entering the Margin Space Website your device may automatically be issued with
                a cookie. This is a text file which is stored in your web browser and identifies
                your device (but not your individual identity) to the browser's local server. The
                information obtained via cookie may include your Internet Protocol or "IP" address,
                the date, time and duration of your visit. Margin Space will only use cookies for
                the purpose of monitoring the use of its Website.
              </p>
              <p className="mb-4 text-sm leading-relaxed text-white/90 md:text-base">
                It enables the Website to remember your actions and preferences (such as login,
                language, font size and other display preferences) over a period of time, so you
                don't have to keep re-entering them whenever you come back to the site or browse
                from one page to another.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-xl font-semibold text-white md:text-2xl">
                What cookies do we use?
              </h2>
              <p className="mb-4 text-sm leading-relaxed text-white/90 md:text-base">
                Please note that the names of cookies, pixels and other technologies may change
                over time. We also may use certain cookies on only a limited number of pages that
                you visit on our Website to avoid unnecessary collection of your Personal Data.
                Please note that our cookies do not process any Personal Data.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-xl font-semibold text-white md:text-2xl">
                How to deactivate cookie?
              </h2>
              <p className="mb-4 text-sm leading-relaxed text-white/90 md:text-base">
                If you don't like the idea of cookies or certain types of cookies, you can deactivate
                them within your browser's settings. For this purpose, you can change your browser's
                settings to delete cookies that have already been set and to not accept new cookies.
                Browser manufacturers provide help pages relating to cookie management in their
                products. We recommend you to reach your browser manufacture website to find details
                of how to deactivate cookies.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-xl font-semibold text-white md:text-2xl">
                Amendment to Cookie Policy
              </h2>
              <p className="mb-4 text-sm leading-relaxed text-white/90 md:text-base">
                We reserve the right to amend this Cookie Policy at any time without notice. It is
                therefore recommended that it be viewed on a regular basis in order to monitor any
                such changes. Your continued use of the Website after a new Cookie Policy has been
                posted will be deemed acceptance of the new Cookie Policy.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-xl font-semibold text-white md:text-2xl">Contact us</h2>
              <p className="mb-4 text-sm leading-relaxed text-white/90 md:text-base">
                If you have any questions or comments about this Cookie Policy or if you would like
                us to update information we have about you, please email: support@marginspace.io.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CookiePolicy;

