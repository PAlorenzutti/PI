package br.ufes.gerenciapet.backend.model;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import br.ufes.gerenciapet.backend.utils.enums.StatusEvento;
import br.ufes.gerenciapet.backend.utils.enums.TipoEvento;

/**
 * Entidade que representa um evento ofertado por um grupo PET.
 */
@Entity
public class Evento {

    /**
     * Identificador único do evento.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * Nome público do evento.
     */
    @Column(nullable = false, length = 200)
    private String nome;

    /**
     * Descrição detalhada do evento.
     */
    @Column(nullable = false, length = 1000)
    private String descricao;

    /**
     * Perfil esperado dos alunos participantes.
     */
    @Column(nullable = false, length = 200)
    private String perfilAlunoEsperado;

    /**
     * Carga horária total do evento.
     */
    @Column(nullable = false)
    private Integer cargaHorariaTotal;

    /**
     * Quantidade de vagas disponíveis para inscrição.
     */
    @Column(nullable = false)
    private Integer vagasDisponiveis;

    /**
     * Data de início do evento.
     */
    @Column(nullable = false)
    @Temporal(TemporalType.DATE)
    private Date dataInicio;

    /**
     * Data de encerramento do evento.
     */
    @Column(nullable = false)
    @Temporal(TemporalType.DATE)
    private Date dataFim;

    /**
     * Horarios de realizacao do evento.
     */
    @Column(nullable = false, length = 200)
    private String horarios;

    /**
     * Status atual do evento.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusEvento status;

    /**
     * Tipo ou categoria do evento.
     */
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoEvento tipo;

    /**
     * Grupo PET responsável pelo evento.
     */
    @ManyToOne
    @JoinColumn(name = "grupo_pet_id")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private GrupoPet grupoPet;

    /**
     * Inscrições vinculadas ao evento.
     */
    @OneToMany(mappedBy = "evento", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Inscricao> inscricoes = new ArrayList<>();

    /**
     * Retorna o identificador do evento.
     *
     * @return identificador do evento.
     */
    public Long getId() { return id; }
    /**
     * Define o identificador do evento.
     *
     * @param id identificador do evento.
     */
    public void setId(Long id) { this.id = id; }
    /**
     * Retorna o nome do evento.
     *
     * @return nome do evento.
     */
    public String getNome() { return nome; }
    /**
     * Define o nome do evento.
     *
     * @param nome nome do evento.
     */
    public void setNome(String nome) { this.nome = nome; }
    /**
     * Retorna a descrição do evento.
     *
     * @return descrição do evento.
     */
    public String getDescricao() { return descricao; }
    /**
     * Define a descrição do evento.
     *
     * @param descricao descrição do evento.
     */
    public void setDescricao(String descricao) { this.descricao = descricao; }
    /**
     * Retorna o perfil esperado dos alunos.
     *
     * @return perfil esperado.
     */
    public String getPerfilAlunoEsperado() { return perfilAlunoEsperado; }
    /**
     * Define o perfil esperado dos alunos.
     *
     * @param perfilAlunoEsperado perfil esperado.
     */
    public void setPerfilAlunoEsperado(String perfilAlunoEsperado) { this.perfilAlunoEsperado = perfilAlunoEsperado; }
    /**
     * Retorna a carga horária total.
     *
     * @return carga horária total.
     */
    public Integer getCargaHorariaTotal() { return cargaHorariaTotal; }
    /**
     * Define a carga horária total.
     *
     * @param cargaHorariaTotal carga horária total.
     */
    public void setCargaHorariaTotal(Integer cargaHorariaTotal) { this.cargaHorariaTotal = cargaHorariaTotal; }
    /**
     * Retorna o número de vagas disponíveis.
     *
     * @return vagas disponíveis.
     */
    public Integer getVagasDisponiveis() { return vagasDisponiveis; }
    /**
     * Define o número de vagas disponíveis.
     *
     * @param vagasDisponiveis vagas disponíveis.
     */
    public void setVagasDisponiveis(Integer vagasDisponiveis) { this.vagasDisponiveis = vagasDisponiveis; }
    /**
     * Retorna a data de início do evento.
     *
     * @return data de início.
     */
    public Date getDataInicio() { return dataInicio; }
    /**
     * Define a data de início do evento.
     *
     * @param dataInicio data de início.
     */
    public void setDataInicio(Date dataInicio) { this.dataInicio = dataInicio; }
    /**
     * Retorna a data de fim do evento.
     *
     * @return data de fim.
     */
    public Date getDataFim() { return dataFim; }
    /**
     * Define a data de fim do evento.
     *
     * @param dataFim data de fim.
     */
    public void setDataFim(Date dataFim) { this.dataFim = dataFim; }
    /**
     * Retorna os horários do evento.
     *
     * @return horários do evento.
     */
    public String getHorarios() { return horarios; }
    /**
     * Define os horários do evento.
     *
     * @param horarios horários do evento.
     */
    public void setHorarios(String horarios) { this.horarios = horarios; }
    /**
     * Retorna o status do evento.
     *
     * @return status do evento.
     */
    public StatusEvento getStatus() { return status; }
    /**
     * Define o status do evento.
     *
     * @param status status do evento.
     */
    public void setStatus(StatusEvento status) { this.status = status; }
    /**
     * Retorna o tipo do evento.
     *
     * @return tipo do evento.
     */
    public TipoEvento getTipo() { return tipo; }
    /**
     * Define o tipo do evento.
     *
     * @param tipo tipo do evento.
     */
    public void setTipo(TipoEvento tipo) { this.tipo = tipo; }
    /**
     * Retorna o grupo PET responsável pelo evento.
     *
     * @return grupo PET responsável.
     */
    public GrupoPet getGrupoPet() { return grupoPet; }
    /**
     * Define o grupo PET responsável pelo evento.
     *
     * @param grupoPet grupo PET responsável.
     */
    public void setGrupoPet(GrupoPet grupoPet) { this.grupoPet = grupoPet; }
    /**
     * Retorna as inscrições do evento.
     *
     * @return lista de inscrições.
     */
    public List<Inscricao> getInscricoes() { return inscricoes; }
    /**
     * Define as inscrições do evento.
     *
     * @param inscricoes lista de inscrições.
     */
    public void setInscricoes(List<Inscricao> inscricoes) { this.inscricoes = inscricoes; }
}
