const rows = [
  { label: 'Equipamento', sopre: 'Compacto, decorativo', tradicional: 'Grande, industrial' },
  { label: 'Contrato', sopre: 'Mensal, cancela quando quiser', tradicional: '12-24 meses' },
  { label: 'Instalação', sopre: 'Você mesmo, 30 segundos', tradicional: 'Visita técnica agendada' },
  { label: 'Controle', sopre: 'App no celular', tradicional: 'Técnico presencial' },
  { label: 'Preço', sopre: 'A partir de R$89,90/mês', tradicional: 'R$300-800/mês' },
];

export default function CompareTable() {
  return (
    <div className="overflow-x-auto rounded-2xl border border-sand">
      <table className="w-full min-w-[560px] border-collapse text-left">
        <thead>
          <tr className="bg-ink text-white">
            <th className="p-4 font-sans text-sm font-medium">Critério</th>
            <th className="p-4 font-serif text-lg">Sopre.me</th>
            <th className="p-4 font-sans text-sm font-medium">Empresas tradicionais</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.label} className={i % 2 === 0 ? 'bg-white' : 'bg-offwhite'}>
              <td className="p-4 text-sm font-medium text-ink/70">{row.label}</td>
              <td className="p-4 text-sm font-medium text-sage">{row.sopre}</td>
              <td className="p-4 text-sm text-ink/60">{row.tradicional}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
