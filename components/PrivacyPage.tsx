import type { Metadata } from "next";
import { BrandIcon } from "@/components/brand/Brand";
import { LangSwitch } from "@/components/ui/LangSwitch";
import { LocaleProvider } from "@/lib/i18n";
import { LOCALE_PATH, PRIVACY_PATH, type Locale } from "@/lib/locale";
import { getSiteContent } from "@/lib/siteContent";

/*
 * Política de privacidade / Privacy policy — /privacidade and /en/privacy.
 * Who is responsible for the data: the person behind PREAMAR (sole trader).
 */

const CONTROLLER = {
  name: "Ana Catarina Nora Fidalgo Rodrigues",
  nif: "265051649",
  address: "", // morada para contacto — vazio = não aparece
};
const UPDATED = { pt: "15 de outubro de 2026", en: "15 October 2026" };

type Block = { h: string; id?: string; p: (string | string[])[] }; // string[] = list

function content(locale: Locale, email: string): { title: string; intro: string; blocks: Block[] } {
  const who = [
    CONTROLLER.name,
    `NIF ${CONTROLLER.nif}`,
    CONTROLLER.address,
    email,
  ].filter(Boolean);

  if (locale === "en") {
    return {
      title: "Privacy policy",
      intro:
        "This policy explains what personal data PREAMAR collects through this website, why, for how long, and what your rights are. We only ask for what we need to answer your request.",
      blocks: [
        {
          h: "Who is responsible",
          p: [
            "PREAMAR is run by a sole trader, who is the controller of your personal data:",
            who,
            `For any question about your data, write to ${email}.`,
          ],
        },
        {
          h: "What we collect",
          p: [
            "When you fill in the booking form: name, email, mobile number, profession or company, where you live, what you are interested in, number of people (offices), days per week, when you would need the space, whether you need a locker, whether you accept booking with a deposit and its amount, the language of the page and the date of the request.",
            "We do not ask for payment details on the website.",
          ],
        },
        {
          h: "Why we use it",
          p: [
            [
              "To answer your request, show you the space and prepare a proposal — steps taken at your request before a contract (Article 6(1)(b) GDPR).",
              "To manage your booking and deposit, if you go ahead (performance of a contract).",
              "To measure which Google ads bring in requests, only if you accept cookies (consent, Article 6(1)(a) GDPR).",
            ],
            "We do not sell your data, do not use it for automated decisions and do not send newsletters without asking you first.",
          ],
        },
        {
          h: "How long we keep it",
          p: [
            "Requests that do not lead to a contract are deleted within 12 months of our last contact. If you become a member, we keep your data while the contract lasts and afterwards only what the law requires us to keep (e.g. invoices, for 10 years).",
          ],
        },
        {
          h: "Who else handles it",
          p: [
            "Only service providers we need to run the website, acting on our instructions: Vercel (website hosting), Supabase (database where requests are stored) and Google (advertising measurement, only with your consent). Some of them may process data outside the European Economic Area; in that case the transfer is covered by the European Commission's Standard Contractual Clauses or the EU–US Data Privacy Framework.",
          ],
        },
        {
          h: "Cookies",
          id: "cookies",
          p: [
            "The website works without cookies. With your consent, we use Google Ads cookies to know which ads lead to booking requests. If you decline, Google only receives anonymous signals without cookies.",
            "Your choice is saved in your browser so we don't ask again. You can change it at any time through “Cookies” at the bottom of the page.",
          ],
        },
        {
          h: "Your rights",
          p: [
            `You can ask to access, correct or delete your data, to restrict or object to its use, to receive it in a portable format, and withdraw your consent at any time — just write to ${email}. You can also complain to the Portuguese data protection authority, CNPD (www.cnpd.pt).`,
          ],
        },
        {
          h: "Changes",
          p: ["If this policy changes, the new version is published here with the date of the update."],
        },
      ],
    };
  }

  return {
    title: "Política de privacidade",
    intro:
      "Esta política explica que dados pessoais a PREAMAR recolhe através deste site, para quê, durante quanto tempo e quais são os teus direitos. Só pedimos o necessário para responder ao teu pedido.",
    blocks: [
      {
        h: "Quem é responsável",
        p: [
          "A PREAMAR é explorada por uma empresária em nome individual, responsável pelo tratamento dos teus dados:",
          who,
          `Para qualquer questão sobre os teus dados, escreve para ${email}.`,
        ],
      },
      {
        h: "Que dados recolhemos",
        p: [
          "Quando preenches o formulário de reserva: nome, email, telemóvel, profissão ou empresa, onde moras, o que te interessa, número de pessoas (gabinetes), dias por semana, quando precisarias do espaço, se precisas de cacifo, se aceitas reservar com sinal e o respetivo valor, a língua da página e a data do pedido.",
          "Não pedimos dados de pagamento no site.",
        ],
      },
      {
        h: "Para que os usamos",
        p: [
          [
            "Responder ao teu pedido, mostrar-te o espaço e preparar uma proposta — diligências pré-contratuais a teu pedido (artigo 6.º, n.º 1, alínea b) do RGPD).",
            "Gerir a tua reserva e o sinal, se avançares (execução do contrato).",
            "Medir que anúncios do Google trazem pedidos, apenas se aceitares os cookies (consentimento, artigo 6.º, n.º 1, alínea a) do RGPD).",
          ],
          "Não vendemos os teus dados, não os usamos para decisões automáticas e não enviamos newsletters sem te perguntar primeiro.",
        ],
      },
      {
        h: "Durante quanto tempo",
        p: [
          "Os pedidos que não resultem em contrato são apagados até 12 meses depois do último contacto. Se ficares connosco, guardamos os dados enquanto durar o contrato e, depois, apenas o que a lei obriga a conservar (por exemplo, faturas, durante 10 anos).",
        ],
      },
      {
        h: "Quem mais tem acesso",
        p: [
          "Apenas prestadores de serviços necessários ao funcionamento do site, que seguem as nossas instruções: Vercel (alojamento do site), Supabase (base de dados onde ficam os pedidos) e Google (medição de anúncios, só com o teu consentimento). Alguns podem tratar dados fora do Espaço Económico Europeu; nesse caso, a transferência está protegida pelas Cláusulas Contratuais-Tipo da Comissão Europeia ou pelo Quadro de Privacidade de Dados UE–EUA.",
        ],
      },
      {
        h: "Cookies",
        id: "cookies",
        p: [
          "O site funciona sem cookies. Com o teu consentimento, usamos cookies do Google Ads para saber que anúncios levam a pedidos de reserva. Se recusares, o Google recebe apenas sinais anónimos, sem cookies.",
          "A tua escolha fica guardada no teu browser para não voltarmos a perguntar. Podes mudá-la a qualquer momento em “Cookies”, no fundo da página.",
        ],
      },
      {
        h: "Os teus direitos",
        p: [
          `Podes pedir acesso, retificação ou apagamento dos teus dados, limitar ou opor-te ao seu tratamento, recebê-los num formato portável e retirar o consentimento a qualquer momento — basta escreveres para ${email}. Podes também apresentar reclamação à Comissão Nacional de Proteção de Dados (www.cnpd.pt).`,
        ],
      },
      {
        h: "Alterações",
        p: ["Se esta política mudar, publicamos aqui a nova versão com a data da atualização."],
      },
    ],
  };
}

export function privacyMetadata(locale: Locale): Metadata {
  const title = locale === "en" ? "Privacy policy" : "Política de privacidade";
  return {
    title,
    description:
      locale === "en"
        ? "How PREAMAR, coworking in Montijo, handles the personal data sent through its website."
        : "Como a PREAMAR, cowork no Montijo, trata os dados pessoais enviados através do site.",
    alternates: {
      canonical: PRIVACY_PATH[locale],
      languages: { "pt-PT": PRIVACY_PATH.pt, en: PRIVACY_PATH.en, "x-default": PRIVACY_PATH.pt },
    },
  };
}

export async function PrivacyPage({ locale }: { locale: Locale }) {
  const { sections } = await getSiteContent();
  const email = sections.footer.email || "geral@preamar.pt";
  const c = content(locale, email);
  const back = locale === "en" ? "Back to the website" : "Voltar ao site";

  return (
    <LocaleProvider locale={locale}>
      <main className="bg-pm-bg text-pm-ink font-body min-h-screen">
        <header className="flex items-center justify-between px-6 md:px-10 py-6 border-b border-pm-line">
          <div className="flex items-center gap-5">
            <a href={LOCALE_PATH[locale]} aria-label="PREAMAR" style={{ color: "inherit" }}>
              <BrandIcon size={30} color="#3F4346" />
            </a>
            <LangSwitch hrefs={PRIVACY_PATH} />
          </div>
          <a
            href={LOCALE_PATH[locale]}
            style={{ color: "inherit" }}
            className="font-label font-bold text-[11px] tracking-[0.15em] uppercase"
          >
            {back}
          </a>
        </header>

        <article className="max-w-[720px] mx-auto px-6 py-16 md:py-24">
          <h1 className="font-display text-[40px] md:text-[52px] leading-[1.05] mb-6">{c.title}</h1>
          <p className="text-pm-graphite text-[18px] leading-relaxed mb-14">{c.intro}</p>

          {c.blocks.map((b) => (
            <section key={b.h} id={b.id} className="mb-12 scroll-mt-8">
              <h2 className="font-label font-bold text-[12px] tracking-[0.16em] uppercase text-pm-concrete mb-4">{b.h}</h2>
              {b.p.map((x, i) =>
                Array.isArray(x) ? (
                  <ul key={i} className="m-0 mb-4 pl-0 list-none flex flex-col gap-2">
                    {x.map((li) => (
                      <li key={li} className="flex gap-3 text-[16px] leading-relaxed">
                        <span aria-hidden="true" className="text-pm-sky">—</span>
                        <span>{li}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p key={i} className="text-[16px] leading-relaxed mb-4">
                    {x}
                  </p>
                )
              )}
            </section>
          ))}

          <p className="font-label text-[11px] tracking-[0.12em] uppercase text-pm-concrete mt-16">
            {locale === "en" ? `Last updated: ${UPDATED.en}` : `Última atualização: ${UPDATED.pt}`}
          </p>
        </article>
      </main>
    </LocaleProvider>
  );
}
