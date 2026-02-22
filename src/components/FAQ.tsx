import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Quanto tempo demora para receber meu pedido?",
    a: "O prazo depende da data da próxima viagem a Miami. Em média, entre 2 a 4 semanas após a confirmação do pedido.",
  },
  {
    q: "Quais formas de pagamento são aceitas?",
    a: "Aceitamos Pix, transferência bancária e cartão de crédito. O pagamento é feito em reais.",
  },
  {
    q: "Como é calculado o preço final?",
    a: "O preço final inclui o valor do produto em dólar convertido para real, mais a taxa de serviço da MalaBridge. Sem surpresas.",
  },
  {
    q: "Posso comprar qualquer produto dos EUA?",
    a: "Quase tudo! Alguns itens são proibidos pela Receita Federal (como armas e medicamentos controlados). Consulte-nos antes para confirmar.",
  },
  {
    q: "E se o produto vier com defeito?",
    a: "Nós verificamos todos os produtos antes de trazer. Caso haja algum problema, auxiliamos na troca ou devolução.",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="py-24">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-16">
          <span className="font-body text-sm font-semibold tracking-widest uppercase text-miami-orange mb-2 block">
            Tire suas dúvidas
          </span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground">
            Perguntas frequentes
          </h2>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`}>
              <AccordionTrigger className="font-body text-sm font-medium text-left">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="font-body text-sm text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
