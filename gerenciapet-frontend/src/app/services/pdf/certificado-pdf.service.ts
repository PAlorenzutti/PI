import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class CertificadoPdfService {

  constructor() { }

  public gerarCertificado(certificado: any, usuario: any, inscricao: any, evento: any, nomeTutor: string = 'Tutor Coordenador', siglaGrupoPet: string = '') {
    const doc = new jsPDF('landscape');
    let height = 35;

    // Borda do Certificado
    doc.setLineWidth(2);
    doc.rect(10, 10, 277, 190);
    doc.setLineWidth(0.5);
    doc.rect(12, 12, 273, 186);

    // Título Principal
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(32);
    doc.setTextColor(41, 128, 185); // Azul padrão
    doc.text('CERTIFICADO DE PARTICIPAÇÃO', 148, height, { align: 'center' });
    height += 25;

    // Corpo do texto (Padrão)
    doc.setFontSize(18);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50, 50, 50);
    doc.text('O sistema Gerencia PET certifica que', 148, height, { align: 'center' });
    height += 25;

    // Nome do Usuário
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(26);
    doc.text((usuario?.nome || 'Usuário').toUpperCase(), 148, height, { align: 'center' });
    height += 25;

    // Descrição dinâmica dependendo do tipo
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(16);
    doc.setTextColor(50, 50, 50);

    if (certificado.tipo === 'HORAS_COMPLEMENTARES' && evento) {
      doc.text(`concluiu com sucesso a participação no evento "${evento.nome}",`, 148, height, { align: 'center' });
      height += 12;
      doc.text(`realizado no período de ${this.formatDate(evento.dataInicio)} a ${this.formatDate(evento.dataFim)},`, 148, height, { align: 'center' });
      height += 12;

      const freq = inscricao?.frequencia || 0;
      const nota = inscricao?.nota || 0;
      doc.text(`cumprindo carga horária total de ${evento.cargaHorariaTotal} horas, com frequência de ${freq}% e nota final ${nota}.`, 148, height, { align: 'center' });
    } else {
      doc.text(`participou de maneira integral das atividades desempenhadas pelo grupo PET,`, 148, height, { align: 'center' });
      height += 12;
      doc.text(`cumprindo todas as suas obrigações relacionadas à extensão e`, 148, height, { align: 'center' });
      height += 12;
      doc.text(`fazendo jus às suas horas formativas certificadas.`, 148, height, { align: 'center' });
    }

    height += 15;

    // Informações Adicionais na Tabela usando autoTable
    const cabecalho = [['Código de Validação', 'Data de Emissão', 'Tipo de Certificado']];
    const tipoLabel = certificado.tipo === 'HORAS_COMPLEMENTARES' ? 'Horas Complementares' : 'Horas de Extensão';
    const corpo = [
        [certificado.codigoValidacao, this.formatDate(certificado.dataEmissao), tipoLabel]
    ];

    autoTable(doc, {
        startY: height,
        head: cabecalho,
        body: corpo,
        theme: 'striped',
        headStyles: { fillColor: [41, 128, 185], halign: 'center' },
        bodyStyles: { halign: 'center' },
        margin: { left: 30, right: 30 }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 15;

    // Assinatura (movida para o centro da página)
    doc.setLineWidth(0.5);
    doc.line(98.5, finalY, 198.5, finalY); // Linha da assinatura centralizada (largura 100)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(nomeTutor.toUpperCase(), 148.5, finalY + 6, { align: 'center' }); // Nome do Tutor
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);

    const textoGrupo = siglaGrupoPet ? `Tutor Coordenador do Grupo PET "${siglaGrupoPet}"` : 'Tutor Coordenador do Grupo PET';
    doc.text(textoGrupo, 148.5, finalY + 11, { align: 'center' });

    // Salvar
    doc.save(`Certificado_${certificado.codigoValidacao}.pdf`);
  }

  private formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    return date.toLocaleDateString('pt-BR');
  }
}
