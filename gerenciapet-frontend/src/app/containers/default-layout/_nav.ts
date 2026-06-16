import { INavData } from "@coreui/angular";

// ##################################################################################################################
// ROLE_ADMIN
// ##################################################################################################################
export const navItemsAdmin: INavData[] = [
	{
		name: "Início",
		url: "/dashboard",
		iconComponent: { name: "cil-home" },
	},
	{
		title: true,
		name: "CADASTRAR",
	},
	{
		name: "Cadastros",
		url: "dashboard",
		iconComponent: { name: "cil-library-add" },
		children: [
			{
				name: "Grupo PET",
				url: "/dashboard/cadastrar/grupo-pet",
				iconComponent: { name: "" },
			},
			{
				name: "Tutor",
				url: "/dashboard/cadastrar/tutor",
				iconComponent: { name: "" }
			}
		]
	},
	{
		title: true,
		name: "VISUALIZAR / GERENCIAR",
	},
	{
		name: "Gerenciar",
		url: "dashboard/visualizar",
		iconComponent: { name: "cil-magnifying-glass" },
		children: [
			{
				name: "Grupos PET",
				url: "/dashboard/visualizar/grupos-pet",
				iconComponent: { name: "" },
			},
			{
				name: "Todos os Usuários",
				url: "/dashboard/usuario/visualizar",
				iconComponent: { name: "" },
			}
		],
	},
	{
		title: true,
		name: "SISTEMA",
	},
	{
		name: "Meus dados",
		url: "/dashboard/usuario/editar",
		iconComponent: { name: "cil-contact" }
	}
];

// ##################################################################################################################
// ROLE_TUTOR
// ##################################################################################################################
export const navItemsTutor: INavData[] = [
	{
		name: "Início",
		url: "/dashboard",
		iconComponent: { name: "cil-home" },
	},
	{
		title: true,
		name: "MEU PET",
	},
	{
		name: "Gestão do Grupo",
		url: "dashboard/meu-pet",
		iconComponent: { name: "cil-group" },
		children: [
			{
				name: "Equipe",
				url: "/dashboard/meu-pet/equipe",
				iconComponent: { name: "" },
			},
			{
				name: "Dados do Grupo",
				url: "/dashboard/meu-pet/dados",
				iconComponent: { name: "" },
			}
		],
	},
	{
		title: true,
		name: "EVENTOS E CURSOS",
	},
	{
		name: "Eventos",
		url: "dashboard/eventos",
		iconComponent: { name: "cil-calendar" },
		children: [
			{
				name: "Criar Novo Evento",
				url: "/dashboard/eventos/novo",
				iconComponent: { name: "" },
			},
			{
				name: "Gerenciar Eventos",
				url: "/dashboard/eventos/gerenciar",
				iconComponent: { name: "" },
			},
			{
				name: "Emitir Certificados",
				url: "/dashboard/eventos/certificados",
				iconComponent: { name: "" },
			}
		],
	},
	{
		title: true,
		name: "SISTEMA",
	},
	{
		name: "Meus dados",
		url: "/dashboard/usuario/editar",
		iconComponent: { name: "cil-contact" }
	}
];

// ##################################################################################################################
// ROLE_EXTENSIONISTA
// ##################################################################################################################
export const navItemsExtensionista: INavData[] = [
	{
		name: "Início",
		url: "/dashboard",
		iconComponent: { name: "cil-home" },
	},
	{
		title: true,
		name: "GESTÃO DE EVENTOS",
	},
	{
		name: "Eventos",
		url: "dashboard/eventos",
		iconComponent: { name: "cil-calendar" },
		children: [
			{
				name: "Novo Evento",
				url: "/dashboard/eventos/novo",
				iconComponent: { name: "" },
			},
			{
				name: "Controle de Frequência",
				url: "/dashboard/eventos/frequencia",
				iconComponent: { name: "" },
			},
			{
				name: "Lançar Notas",
				url: "/dashboard/eventos/notas",
				iconComponent: { name: "" },
			}
		],
	},
	{
		title: true,
		name: "MEU DESEMPENHO",
	},
	{
		name: "Certificados",
		url: "/dashboard/desempenho/certificados",
		iconComponent: { name: "cil-star" }
	},
	{
		title: true,
		name: "SISTEMA",
	},
	{
		name: "Meus dados",
		url: "/dashboard/usuario/editar",
		iconComponent: { name: "cil-contact" }
	}
];

// ##################################################################################################################
// ROLE_ALUNO
// ##################################################################################################################
export const navItemsAluno: INavData[] = [
	{
		name: "Início / Catálogo",
		url: "/dashboard",
		iconComponent: { name: "cil-home" },
	},
	{
		title: true,
		name: "MINHA ÁREA",
	},
	{
		name: "Meus Cursos",
		url: "/dashboard/minha-area/cursos",
		iconComponent: { name: "cil-book" }
	},
	{
		name: "Meus Certificados",
		url: "/dashboard/minha-area/certificados",
		iconComponent: { name: "cil-star" }
	},
	{
		title: true,
		name: "SISTEMA",
	},
	{
		name: "Meus dados",
		url: "/dashboard/usuario/editar",
		iconComponent: { name: "cil-contact" }
	}
];