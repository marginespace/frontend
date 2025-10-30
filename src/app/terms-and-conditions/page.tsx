import { appName } from '@/constants/metadata';

export const metadata = {
  title: `${appName}: Terms and Conditions`,
};

const TermsAndConditions = () => {
  return (
    <main className="flex h-full w-full flex-col items-center px-4 py-8 md:px-[16px] md:py-[40px]">
      <div className="w-full max-w-4xl">
        <h1 className="mb-8 text-center text-[28px] font-semibold text-white md:text-[36px]">
          Terms and Conditions
        </h1>

        <div className="rounded-[16px] border-2 border-primary/30 bg-linear-white p-6 backdrop-blur-[35px] md:p-8">
          <div className="prose prose-invert max-w-none">
            <p className="mb-6 text-sm text-white/80 md:text-base">
              <strong>Effective as of August 01, 2025</strong>
            </p>

            <p className="mb-4 text-sm leading-relaxed text-white/90 md:text-base">
              The following Terms and Conditions (the "Agreement") is a legal agreement between you
              ("you") and Margin Space (the "Platform", "we" or "us") for use of the website
              https://marginspace.io (the "Website"). Please read this Agreement carefully as it
              constitutes a binding force and regulates relations between you and the Platform.
              Margin Space is a decentralized finance (DeFi) protocol that operates on blockchain
              networks. The Platform is not a licensed financial institution and does not provide
              regulated financial services.
            </p>

            <section className="mb-8">
              <h2 className="mb-4 text-xl font-semibold text-white md:text-2xl">
                1. Definitions
              </h2>
              <div className="space-y-3 text-sm leading-relaxed text-white/90 md:text-base">
                <p>
                  <strong>"Blockchain"</strong> means a distributed ledger technology that
                  contains list of blocks (digital records) that are linked via cryptographic
                  hashes.
                </p>
                <p>
                  <strong>"Digital asset"</strong> means a specific asset that exists in digital
                  form and supported by Blockchain network.
                </p>
                <p>
                  <strong>"Digital wallet"</strong> means software, online service or electronic
                  device used for storing of virtual assets.
                </p>
                <p>
                  <strong>"Earn"</strong> means a process when you stake the specific Digital
                  assets to obtain remuneration for such Staking.
                </p>
                <p>
                  <strong>"Fiat currency"</strong> means a payment instrument issued and supported
                  by government of a specific state and used for monetary transactions.
                </p>
                <p>
                  <strong>"Platform"</strong> means online platform created by us where you can
                  place your Digital assets to participate in specific staking pools.
                </p>
                <p>
                  <strong>"Reward"</strong> means a remuneration received in the form of Digital
                  assets for the participation in Staking.
                </p>
                <p>
                  <strong>"Staking"</strong> means digital process where you contribute Digital
                  assets to the Platform and earn rewards by participating in our Staking Services.
                </p>
                <p>
                  <strong>"Staking pool"</strong> means a joint participation of Staking
                  contributors in combined platform of several Staking service providers.
                </p>
                <p>
                  <strong>"Virtual currency"</strong> means a Digital Asset issued by the specific
                  developing company and used and accepted electronically among the members of a
                  specific virtual community.
                </p>
                <p>
                  <strong>"Withdrawal"</strong> means transfer of Digital assets from Staking pool
                  to your Digital wallet specified for Staking purposes.
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-xl font-semibold text-white md:text-2xl">
                1. Acceptance of the Agreement
              </h2>
              <p className="mb-4 text-sm leading-relaxed text-white/90 md:text-base">
                By accessing and using the Website, you are confirming that you have read and agree
                to be bound by these Terms and Conditions, Platform's Privacy Policy, and other
                notices posted through the Website. By this confirmation you warrant and approve
                that you have the power and authority to enter into this Agreement. If you do not
                acknowledge or agree with the above, you may not access or use the Website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-xl font-semibold text-white md:text-2xl">
                2. Update of Agreement
              </h2>
              <p className="mb-4 text-sm leading-relaxed text-white/90 md:text-base">
                From time to time, we may modify this Agreement. We will notify you by email or by
                presenting you with a new version of the Agreement for you to accept if we make
                modifications that materially change your rights. Your continued use of the Website
                after the effective date of modification of the Agreement will indicate your
                acceptance of the Agreement as updated.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-xl font-semibold text-white md:text-2xl">3. Services</h2>
              <p className="mb-4 text-sm leading-relaxed text-white/90 md:text-base">
                Through the Website you may obtain access to the Platform that allows you to
                contribute your Digital Assets to our Staking Pools and earn Rewards by
                participating in our Staking Services (the "Services"). The Staking Services are
                dedicated IT-services set on Blockchain, which means a general operation activity
                that is provided to you by means of smart contract supported in the specific
                Blockchain network, subject to the terms and conditions of this Agreement. The
                Platform may perform any or all of Staking Services directly or through one or more
                service provider(s). You may find the resources provided on our Platform for more
                information regarding Staking Services.
              </p>
              <p className="mb-4 text-sm leading-relaxed text-white/90 md:text-base">
                To receive the Services, you don't need to register any personal accounts or
                deposit your Virtual or Fiat currencies to the Platform's balance. We provide
                dedicated solution in the form of bridge between your Digital Wallet and Staking
                service providers. Bridges are operated fully decentralized via one of eight
                blockchain networks available at the Website. Accordingly, the Platform doesn't
                deposit or operate your Virtual Assets, we provide specifically technical solution
                related to the Staking services.
              </p>

              <h3 className="mb-3 mt-6 text-lg font-semibold text-white md:text-xl">
                Staking Services
              </h3>
              <p className="mb-4 text-sm leading-relaxed text-white/90 md:text-base">
                When you place a specific Digital asset that is eligible for Staking, you consent
                to such Digital asset being staked in part or in entirety via the Platform in the
                Staking pool of the end service providers. For clarity, the Staking Services are
                included within services under this Agreement are not directly provided by the
                Platform. Platform provides intermediary technical services that allow to you to stake
                your Digital assets at the Staking pool that combines different staking service
                providers. You retain ownership of each Digital asset that is staked, and each
                staked Digital asset remains your property while staked.
              </p>

              <h3 className="mb-3 mt-6 text-lg font-semibold text-white md:text-xl">
                Selection of Staking Services and Staking Reward Order
              </h3>
              <p className="mb-4 text-sm leading-relaxed text-white/90 md:text-base">
                When you decide to contribute a Digital asset from your Digital wallet to the
                Staking pool, the Platform will remit to you the applicable percentage of staking
                Rewards received from the supported protocol of Digital asset attributable to your
                staked Digital asset (the "Staking Rewards"), provided that the relevant percentage
                and timeframe of such remittances will: (i) be determined by the Platform at its
                sole discretion; (ii) be subject to the Platform's Staking fee; (iii) vary by the
                supported protocol of the Digital asset; and (iv) be further transferred to your
                Digital wallet.
              </p>
              <p className="mb-4 text-sm leading-relaxed text-white/90 md:text-base">
                Staking Rewards will be calculated and paid with the decimal precision described at
                Reward Template (https://app.marginspace.com) as may be updated by us from time to
                time in our sole discretion. All Staking Rewards will be paid to your Digital
                wallet in the same digital form as it was placed in Staking.
              </p>
              <p className="mb-4 text-sm leading-relaxed text-white/90 md:text-base">
                Staking Reward rates will be determined at our sole discretion based on the type of
                staked Digital asset, market conditions and risk factors. Such rates have no
                relationship to and may not be competitive with benchmark interest rates provided
                in the market for bank deposit accounts or other similar services.
              </p>
              <p className="mb-4 text-sm leading-relaxed text-white/90 md:text-base">
                You understand and agree that we don't guarantee that you will receive Staking
                Rewards and that the relevant percentage (i) is an estimate only and not guaranteed,
                (ii) may change at any time at Platform's sole discretion, and (iii) may be more or
                less than the actual Staking Rewards Platform receives from the supported protocol of
                the Digital asset. When you elect to participate in Staking, you are instructing
                the Platform to commit the Digital asset to the relevant Blockchain's unbinding
                period and you won't be able to access your tokens during the specified period
                after you elect to unstake. You may choose the specific duration of unbinding period
                when you place your Digital asset into Staking.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-xl font-semibold text-white md:text-2xl">
                4. Obtaining of Services
              </h2>
              <p className="mb-4 text-sm leading-relaxed text-white/90 md:text-base">
                To use the Website services, you don't need to create any accounts at the Platform.
                To obtain the Services, inter alia to place your Digital assets for Staking you need
                to specify details of your Digital wallet at the Platform. This information will be
                held and used in accordance with our Privacy Policy, which can be found at{' '}
                <a href="/privacy-policy" className="text-primary underline-offset-2 hover:underline">
                  Privacy Policy
                </a>{' '}
                (the "Privacy Policy"). You agree that the information provided to the Platform will
                be accurate and complete, and that it will be updated promptly in case of any
                changes.
              </p>
              <p className="mb-4 text-sm leading-relaxed text-white/90 md:text-base">
                Once you connected your Digital wallet to the Platform, you can contribute specific
                Digital assets supported by the Platform from your Digital Wallet to Staking by
                selecting the amount and type of Digital assets you suppose to contribute from your
                Digital wallet. By accepting the terms of this Agreement, you agree to contribute
                only those Digital assets to the Staking program that comprise available and idle
                balances that you initially deposited to your Digital wallet connected to the
                Platform.
              </p>
              <p className="mb-4 text-sm leading-relaxed text-white/90 md:text-base">
                Digital Assets that you contribute from your Digital wallet to the Staking will be
                treated as transferred into Staking pool once they displayed as such on Staking
                page on the Website; provided, that we reserve the right to: (i) reject or remove
                any contribution from the Staking; (ii) establish minimum or maximum Staking
                amounts; or (iii) change Blockchain networks supported at the Platform.
              </p>

              <h3 className="mb-3 mt-6 text-lg font-semibold text-white md:text-xl">Withdrawal</h3>
              <p className="mb-4 text-sm leading-relaxed text-white/90 md:text-base">
                You can order a full or partial withdrawal of your Staked Digital Assets (the
                "Withdrawal") at any time. Upon receipt of your order, we'll initiate the
                Withdrawal process instantly when applicable; however it is provided, that
                Withdrawal may take up to seven days after you submit your order to Withdraw to
                process the transaction. Withdrawal limits based on frequency or volume may apply
                to the ordered amount and will be described on or through the Services. You must
                order the Withdrawal of the Staked Digital assets before you will obtain these
                Digital assets to your Digital wallet. Please keep in mind that if your order of
                Withdrawal of the Staked Digital assets prior the expiration of unbinding period
                you may lose the specific amount of Staking Reward.
              </p>

              <h3 className="mb-3 mt-6 text-lg font-semibold text-white md:text-xl">
                Non-use of your Virtual Assets
              </h3>
              <p className="mb-4 text-sm leading-relaxed text-white/90 md:text-base">
                The Platform doesn't have access to your Digital Assets placed for Staking as well
                as doesn't have access to your Virtual Wallet. Thus we don't use your Digital
                Assets in any possible way and don't have any technical access to your Digital
                Assets placed on Staking.
              </p>

              <h3 className="mb-3 mt-6 text-lg font-semibold text-white md:text-xl">
                Applicable Risks
              </h3>
              <p className="mb-4 text-sm leading-relaxed text-white/90 md:text-base">
                The Staking Reward Service contains the specific risks. Before participating in the
                Staking Rewards Service, it's important to understand its specific and applicable
                risks. You should carefully review this Agreement. You should examine your
                objectives, financial resources and risk tolerance to determine whether contributing
                Digital assets to the Staking Reward Service is appropriate for you. Some, but not
                all, of the risks and uncertainties associated with the Staking Reward Service are:
              </p>
              <ul className="mb-4 ml-6 list-disc space-y-2 text-sm leading-relaxed text-white/90 md:text-base">
                <li>
                  Rewards for Staking of Digital assets are not guaranteed, and we reserve the right
                  to adjust Reward rates at our sole discretion.
                </li>
                <li>
                  We don't offer securities services, are not registered under the securities laws
                  of any jurisdiction and the provision of the Staking Reward Service has not been
                  and won't be registered under the securities laws of any jurisdiction or otherwise
                  approved by securities regulators in any jurisdiction.
                </li>
                <li>
                  Platform isn't a bank, financial or other depository institution. Your Staking
                  contribution is not a deposit account or a bank account. The Staking Reward
                  Service isn't a depository or bank program. Staking of Digital assets are not
                  covered by insurance against losses or subject to applicable regulations or the
                  protections of any comparable organization anywhere in the world.
                </li>
                <li>
                  Legislative and regulatory changes in various jurisdictions may affect the
                  provision of Services and subsequently can lead to amendments in Service provision.
                  The Platform operates as a decentralized protocol and is not subject to traditional
                  financial services licensing requirements.
                </li>
              </ul>
              <p className="mb-4 text-sm leading-relaxed text-white/90 md:text-base">
                When placing your Digital assets into Staking, you confirm, acknowledge, and
                understand that:
              </p>
              <ul className="mb-4 ml-6 list-disc space-y-2 text-sm leading-relaxed text-white/90 md:text-base">
                <li>you have read this Agreement in full prior to use the Staking Reward Service;</li>
                <li>
                  you are personally responsible for, and you assume in full, all risks related to
                  the Staking Reward Service, including all risks provided in this Section, as well
                  as additional risks;
                </li>
                <li>
                  you have determined that such use of Staking Reward Service is appropriate for you.
                </li>
              </ul>
              <p className="mb-4 text-sm leading-relaxed text-white/90 md:text-base">
                You hereby acknowledge and agree that we disclaim and have no responsibility for
                any loss, liability, or damage you may incur, directly or indirectly, in connection
                with the Staking Reward Service, including any loss, liability or damage arising
                directly or indirectly from: (i) your use of or inability to use the Staking Reward
                Service; (ii) any interruptions, errors, or defects of the Staking Reward Service;
                (iii) any third-party disruptions of or unauthorized access to the Staking Reward
                Service; or (iv) any suspension or discontinuance of the Staking Reward Service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-xl font-semibold text-white md:text-2xl">5. Fees</h2>
              <p className="mb-4 text-sm leading-relaxed text-white/90 md:text-base">
                When you receive the Staking Reward, we shall charge our fees for your use of our
                Platform (the "Staking fees"). The amount of Staking fees to be charged by us
                depends on: (i) type of Digital asset placed in Staking, (ii) the supported
                protocol of the Digital asset used for Staking, (iii) duration of Staking and (iv)
                discretion of the Platform. Staking fees are described at Fees Template
                (https://app.marginspace.com).
              </p>
              <p className="mb-4 text-sm leading-relaxed text-white/90 md:text-base">
                The Platform doesn't provide any subscription or similar services that undertakes
                payment of regular scheduled fees. We don't accept payment in Fiat currencies and
                don't accept deposits from you. The Staking fees are calculated in the percentage of
                the Staking Reward and are automatically charged in the same Digital assets as were
                placed for Staking when you receive Staking Reward on your Digital wallet.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-xl font-semibold text-white md:text-2xl">
                6. No Insurance of Digital assets
              </h2>
              <p className="mb-4 text-sm leading-relaxed text-white/90 md:text-base">
                Margin Space is a decentralized finance (DeFi) protocol and is not a banking,
                financial or other depository institution. We do not hold any financial licenses
                and do not provide regulated financial services. When you place your Digital assets
                via Platform for Staking this is not equivalent to the placing of Virtual or Fiat
                Currencies into bank account for depositing purposes. We do not deposit your Digital
                assets on our balance and your Digital assets are not covered by insurance against
                losses or subject to applicable legislation or protections of any comparable
                organization in the world.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-xl font-semibold text-white md:text-2xl">
                7. No Guarantee of Staking Services
              </h2>
              <p className="mb-4 text-sm leading-relaxed text-white/90 md:text-base">
                The Platform cannot guarantee constant or error-free operation of the Staking
                Services or that we'll fix all errors or prevent disruptions or immediately renew
                stainable operation of the network. We may suspend or terminate the Staking Services
                at our sole discretion at any time. In the event of any disruptions, suspension, or
                termination of the Staking Services, any staked Digital assets may stop generating
                the Staking Rewards and you may not receive any and you may forfeit all Staking
                Rewards whatsoever. The decision as to whether and to what extent Staking Services
                are provided is at our sole discretion. You hereby acknowledge and agree that we
                disclaim and have no responsibility for any loss, liability, or damage you may
                incur, directly or indirectly, in connection with the Staking Services, including
                any loss, liability or damage arising directly or indirectly from: (i) your use of
                or inability to use the Staking Services; (ii) any interruptions, errors, or
                defects of the Staking Services; (iii) any third-party disruptions of the Staking
                Services; or (d) any suspension or discontinuance of the Staking Services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-xl font-semibold text-white md:text-2xl">8. Unlawful conduct</h2>
              <p className="mb-4 text-sm leading-relaxed text-white/90 md:text-base">
                As a condition of using the Website, you agree not to use the Website for any
                purpose that is prohibited by this Agreement. You are responsible for all of your
                activity in connection with the Website and you shall obey all the local and
                international laws and regulations and any other applicable legislation. You agree
                that if you take any of the following actions, you will be materially breaching this
                Agreement, and you agree that you shall not:
              </p>
              <ul className="mb-4 ml-6 list-disc space-y-2 text-sm leading-relaxed text-white/90 md:text-base">
                <li>
                  use the Services for any commercial purpose, outside the scope of Website purposes
                  explicitly permitted under this Agreement;
                </li>
                <li>
                  access, monitor, reproduce, distribute, transmit, broadcast, display, sell,
                  copy or otherwise exploit any content of the Services, without our express written
                  permission;
                </li>
                <li>
                  use Digital wallets of any third persons, including but not limited to share use
                  via a network connection, except under the terms of this Agreement;
                </li>
                <li>
                  take any action that imposes, or may impose, in our discretion, an unreasonable
                  or disproportionately large load on our Website;
                </li>
                <li>
                  deep-link to any part of the Website for any purpose without our express written
                  permission;
                </li>
                <li>
                  frame, mirror or otherwise incorporate any part of the Website and Services into
                  any other websites or service without our prior written authorization;
                </li>
                <li>
                  attempt to modify, translate, adapt, edit, decompile, disassemble, or reverse
                  engineer any software programs used by the Platform in connection with the
                  Services;
                </li>
                <li>
                  circumvent, disable or otherwise interfere with security-related features of the
                  Website or features that prevent or restrict use or copying of any content.
                </li>
              </ul>
              <p className="mb-4 text-sm leading-relaxed text-white/90 md:text-base">
                Any such forbidden use shall immediately terminate your use of Services. In such
                case your Staking will be cancelled and your staked Digital assets will be return
                to your Digital wallet without payment of Staking Reward.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-xl font-semibold text-white md:text-2xl">
                9. Changes to the Website
              </h2>
              <p className="mb-4 text-sm leading-relaxed text-white/90 md:text-base">
                From time to time and without prior notice to you, we may change, expand, and
                improve the Website. We may also, at any time, cease to continue operating part or
                all of the Website or selectively disable certain features of the Website. Your use
                of the Website does not entitle you to the continued provision or availability of
                the Website. Any modification or elimination of the Website or any particular
                features will be done in our sole and absolute discretion and without an ongoing
                obligation or liability to you.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-xl font-semibold text-white md:text-2xl">
                10. Age restrictions
              </h2>
              <p className="mb-4 text-sm leading-relaxed text-white/90 md:text-base">
                We provide Services only to persons whose age is above 18 years. You should be
                aware that this Website is not intended or designed to provide any Services to
                persons under the age of 18. If your age is below 18 years please leave the
                Website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-xl font-semibold text-white md:text-2xl">11. Copyright</h2>
              <p className="mb-4 text-sm leading-relaxed text-white/90 md:text-base">
                All rights, title, and interest in and to the Website not expressly granted in this
                Agreement are reserved by the Platform. If you wish to use the Platform's title, trade
                name, trademark, service mark, logo, domain name and/or any other identification with
                notable brand features or other content owned by the Platform, you must obtain
                written permission from the Platform. Permission requests may be sent to
                support@marginspace.io.
              </p>
              <p className="mb-4 text-sm leading-relaxed text-white/90 md:text-base">
                To avoid any doubts, the Platform owns all the text, images, photos, audio, video,
                location data, and all other forms of data or communication that the Platform creates
                and makes available in connection with the Website, including but not limited to
                visual interfaces, interactive features, graphics, design and all other elements and
                components of the Website. Except as expressly and unambiguously provided herein, we
                do not grant you any express or implied rights, and all rights in and to the Website
                and the Platform's content are retained by us.
              </p>
              <p className="mb-4 text-sm leading-relaxed text-white/90 md:text-base">
                If you believe any materials accessible on or from the Website infringe your
                copyright, you may request removal of those materials (or access thereto) from this
                Website by contacting the Platform by sending a notification to
                support@marginspace.io.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-xl font-semibold text-white md:text-2xl">
                12. Warranty disclaimer
              </h2>
              <p className="mb-4 text-sm leading-relaxed text-white/90 md:text-base">
                YOUR USE OF THE WEBSITE IS AT YOUR OWN RISK. NO INFORMATION OR ADVICE GIVEN BY US
                SHALL CREATE A WARRANTY. THE WEBSITE AND ALL THE MATERIALS, INFORMATION, FACILITIES,
                SERVICES AND OTHER CONTENT IN THE WEBSITE ARE PROVIDED "AS IS" AND "AS AVAILABLE"
                WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. TO THE FULLEST EXTENT
                PERMISSIBLE PURSUANT TO APPLICABLE LAW, COMPANY, ITS DIRECTORS, EMPLOYEES, AGENTS,
                REPRESENTATIVES, SUPPLIERS, PARTNERS AMD CONTENT PROVIDERS DISCLAIM ALL WARRANTIES,
                EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO, IMPLIED WARRANTIES OF
                MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. THE
                COMPANY DOES NOT WARRANT THAT THE FUNCTIONS CONTAINED ON OR THROUGH THE WEBSITE
                WILL BE AVAILABLE, UNINTERRUPTED OR ERROR-FREE, THAT DEFECTS WILL BE CORRECTED, OR
                THAT THE WEBSITE IS FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS. THE COMPANY DOES
                NOT WARRANT OR MAKE ANY REPRESENTATIONS REGARDING THE USE OR THE RESULTS OF THE USE
                OF THE WEBSITES LINKED TO THE SERVICE IN TERMS OF THEIR CORRECTNESS, ACCURACY,
                RELIABILITY, OR OTHERWISE. THE COMPANY MAKES NO WARRANTIES THAT YOUR USE OF THE
                WEBSITE WILL NOT INFRINGE THE RIGHTS OF OTHERS AND THE COMPANY ASSUMES NO
                LIABILITY OR RESPONSIBILITY FOR ERRORS OR OMISSIONS ON THE WEBSITE. IF APPLICABLE
                LAW DOES NOT ALLOW THE EXCLUSION OF SOME OR ALL OF THE ABOVE IMPLIED WARRANTIES TO
                APPLY TO YOU, THE ABOVE EXCLUSIONS WILL APPLY TO YOU ONLY TO THE EXTENT PERMITTED BY
                APPLICABLE LAW.
              </p>
              <p className="mb-4 text-sm leading-relaxed text-white/90 md:text-base">
                COMPANY IS NOT A BANK OR OTHER DEPOSITORY INSTITUTION. YOUR DIGITAL ASSETS PLACED
                ON STAKING ARE NOT DEPOSITED ON OUR ACCOUNT OR A BANK ACCOUNT. THE STAKING REWARDS
                PROGRAM ISN'T A DEPOSITORY OR BANK PROGRAM. YOUR DIGITAL ASSETS AS DEFINED HEREIN
                ARE NOT COVERED BY INSURANCE AGAINST LOSSES OR SUBJECT TO APPLICABLE LEGISLATION OR
                THE PROTECTIONS OF ANY COMPARABLE ORGANIZATION ANYWHERE IN THE WORLD.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-xl font-semibold text-white md:text-2xl">
                13. Limitation of liability
              </h2>
              <p className="mb-4 text-sm leading-relaxed text-white/90 md:text-base">
                YOU FURTHER ACKNOWLEDGE AND AGREE THAT IN NO EVENT THE COMPANY SHALL BE LIABLE FOR
                ANY LOSS, INJURY, CLAIM, LIABILITY, OR DAMAGE OF ANY KIND RESULTING FROM YOUR USE
                OF THE WEBSITE. THE COMPANY SHALL NOT BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT,
                INCIDENTAL, OR CONSEQUENTIAL DAMAGES OF ANY KIND WHATSOEVER (INCLUDING, WITHOUT
                LIMITATION, LEGAL FEES AND COURT COSTS) IN ANY WAY DUE TO, RESULTING FROM, OR
                ARISING IN CONNECTION WITH:
              </p>
              <ul className="mb-4 ml-6 list-disc space-y-2 text-sm leading-relaxed text-white/90 md:text-base">
                <li>
                  THE USE OF OR INABILITY TO USE THE WEBSITE, OR ANY INFORMATION AND CONTENT
                  CONTAINED THEREIN;
                </li>
                <li>
                  YOUR PARTICIPATION OR RELIANCE ON ANY INFORMATION AND CONTENT ACCESSED IN
                  CONNECTION WITH THE WEBSITE;
                </li>
                <li>
                  ANY OTHER MATTER RELATING TO THE WEBSITE AND/OR ANY INFORMATION AND CONTENT,
                  REGARDLESS OF WHETHER ANY OF THE FOREGOING IS DETERMINED TO CONSTITUTE A
                  FUNDAMENTAL BREACH OR FAILURE OF ESSENTIAL PURPOSE.
                </li>
              </ul>
              <p className="mb-4 text-sm leading-relaxed text-white/90 md:text-base">
                TO THE EXTENT THIS LIMITATION ON LIABILITY IS PROHIBITED, COMPANY'S SOLE OBLIGATION
                TO YOU FOR DAMAGES SHALL BE LIMITED TO ONE HUNDRED US DOLLARS (USD 100.00).
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-xl font-semibold text-white md:text-2xl">
                14. Enforcement rights
              </h2>
              <p className="mb-4 text-sm leading-relaxed text-white/90 md:text-base">
                We are not obligated to monitor access or use of the Website. However, we reserve
                the right to do so for purposes of operating and maintaining the Website, ensuring
                your compliance with this Agreement, and complying with applicable legal
                requirements. We may disclose unlawful conduct to law enforcement authorities, and
                pursuant to valid legal process, we may cooperate with law enforcement authorities
                to prosecute users who violate the law. We reserve the right (but are not required)
                to remove or disable any content posted to the Website or access to the Website at
                any time and without notice, and at our sole discretion if we determine in our sole
                discretion that your content or use of the Website is objectionable or in violation
                of this Agreement.
              </p>
              <p className="mb-4 text-sm leading-relaxed text-white/90 md:text-base">
                The Platform has no liability or responsibility to users of the Website or any other
                person or entity for performance or nonperformance of the aforementioned activities.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-xl font-semibold text-white md:text-2xl">15. Indemnity</h2>
              <p className="mb-4 text-sm leading-relaxed text-white/90 md:text-base">
                You agree to indemnify, defend, and hold the Platform, its business partners,
                officers, directors, employees, and agents harmless from any loss, liability, claim,
                action, suit, demand, damage, or expense (including reasonable legal fees, costs of
                investigation and court costs) asserted by any third party relating in any way to,
                or in respect of, your use of the Website. The Platform reserves the right to assume
                the exclusive defence and control of any matter subject to indemnification by you,
                which shall not excuse your indemnity obligations.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-xl font-semibold text-white md:text-2xl">
                16. Applicable law and dispute resolution
              </h2>
              <p className="mb-4 text-sm leading-relaxed text-white/90 md:text-base">
                This Agreement shall be governed by and construed in accordance with applicable laws
                related to decentralized protocols and blockchain-based services, without regard to
                conflict of law provisions. Any dispute arising from this Agreement shall be resolved
                through appropriate legal channels in accordance with applicable law.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-xl font-semibold text-white md:text-2xl">
                17. Other provisions
              </h2>
              <p className="mb-4 text-sm leading-relaxed text-white/90 md:text-base">
                If for any reason a court of competent jurisdiction finds any provision of this
                Agreement, or a portion thereof, to be unenforceable, that provision shall be
                enforced to the maximum extent permissible so as to affect the intent of this
                Agreement, and the remainder of this Agreement shall continue in full force and
                effect. A printed version of this Agreement shall be admissible in judicial or
                administrative proceedings.
              </p>
              <p className="mb-4 text-sm leading-relaxed text-white/90 md:text-base">
                No waiver of the Platform of any term or condition set forth in this Agreement shall
                be deemed a further or continuing waiver of such term or condition or a waiver of
                any other term or condition, and any failure of the Platform to assert a right or
                provision under this Agreement shall not constitute a waiver of such right or
                provision. If any provision of this Agreement is held by a court or other tribunal
                of competent jurisdiction to be invalid, illegal or unenforceable for any reason,
                such provision shall be eliminated or limited to the minimum extent such that the
                remaining provisions of this Agreement will continue in full force and effect.
              </p>
              <p className="mb-4 text-sm leading-relaxed text-white/90 md:text-base">
                Upon termination, all provisions of this Agreement, which, by their nature, should
                survive termination, shall survive termination, including, without limitation,
                ownership provisions, warranty disclaimers, and limitations of liability.
              </p>
              <p className="mb-4 text-sm leading-relaxed text-white/90 md:text-base">
                All claims between the parties related to this Agreement will be litigated
                individually, and the parties will not consolidate or seek class treatment for any
                claim unless previously agreed to in writing by the parties.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="mb-4 text-xl font-semibold text-white md:text-2xl">
                Questions and comments
              </h2>
              <p className="mb-4 text-sm leading-relaxed text-white/90 md:text-base">
                If you have any technical comments or questions on any part of the Website or any
                part of these Terms of Use, require support, or have any claims, please contact us
                at support@marginspace.io.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TermsAndConditions;

