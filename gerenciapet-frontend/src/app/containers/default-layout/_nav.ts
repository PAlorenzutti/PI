import { INavData } from "@coreui/angular";
import { IconComponent } from "@coreui/icons-angular";

/**
 * Aqui são definidos os itens do menu lateral. Cada item tem um nome, uma url, um ícone e pode ter filhos.
 * A maneira que o menu lateral aparece é definida no arquivo default-layout.component.html.
 * O menu deve ser diferente de acordo com a ROLE do usuário. Por exemplo, um usuário com ROLE_SUPER, tem acesso a tudo.
 * Por conta disso, existe uma variação de navItems para cada ROLE.
 */

// ##################################################################################################################
// ROLE_SUPER
// ##################################################################################################################
export const navItems: INavData[] = [
	{
		name: "Início",
		url: "/dashboard",
		iconComponent: { name: "cil-home" },
	},
	{
		title: true,
		name: "ATENDIMENTO",
	},
	{
		name: "Serviços",
		url: "dashboard",
		iconComponent: { name: "cil-clipboard" },
		children: [
			{
				name: "Histórico da Mulher",
				url: "/dashboard/historico",
				iconComponent: { name: "" },
			},
			{
				name: "Consulta da Mulher",
				url: "/dashboard/consulta/mulher",
				iconComponent: { name: "" }
			},
			{
				name: "Consulta da Criança",
				url: "/dashboard/consulta/crianca",
				iconComponent: { name: "" }
			}
		]
	},
	{
		title: true,
		name: "USO INTERNO",
	},
	{
		name: "Cadastrar",
		url: "dashboard/cadastrar",
		iconComponent: { name: "cil-library-add" },
		children: [
			{
				name: "Mulher",
				url: "/dashboard/cadastrar/mulher",
				iconComponent: { name: "" },
			},
			{
				name: "Criança",
				url: "/dashboard/cadastrar/criança",
				iconComponent: { name: "" },
			},
			{
				name: "Profissional",
				url: "/dashboard/cadastrar/profissional",
				iconComponent: { name: "" },
			}
		],
	},
	{
		name: "Visualizar",
		url: "dashboard/visualizar",
		iconComponent: { name: "cil-magnifying-glass" },
		children: [
			{
				name: "Mulher",
				url: "/dashboard/visualizar/mulher",
				iconComponent: {name: ""},
			},
			{
				name: "Profissional",
				url: "/dashboard/visualizar/profissional",
				iconComponent: {name: ""}
			}
		],
	},
	{
		title: true,
		name: "SISTEMA",
	},
	{
		name: "Usuário",
		url: "dashboard/usuario",
		iconComponent: { name: "cil-contact" },
		children: [
			{
				name: "Adicionar",
				url: "/dashboard/usuario/novo",
				iconComponent: { name: "" },
			},
			{
				name: "Gerenciar",
				url: "/dashboard/usuario/visualizar",
				iconComponent: { name: "" },
			},
			{
				name: "Meus dados",
				url: "/dashboard/usuario/editar",
				iconComponent: { name: "" },
			},
		],
	},
	{
		name: "Configurações",
		url: "dashboard/configuracoes",
		iconComponent: { name: "cil-cog" },
		children: [
			{
				name: "Atualizar sistema",
				url: "/dashboard/configuracoes/atualizar-sistema",
				iconComponent: { name: "" },
			},
		],
	}
];

// ##################################################################################################################
// ROLE_ADMIN
// ##################################################################################################################

export const navItemsRoleAdmin: INavData[] = [
	{
		name: "Início",
		url: "/dashboard",
		iconComponent: { name: "cil-home" },
	},
	{
		title: true,
		name: "ATENDIMENTO",
	},
	{
		name: "Serviços",
		url: "dashboard",
		iconComponent: { name: "cil-clipboard" },
		children: [
			{
				name: "Histórico da Mulher",
				url: "/dashboard/historico",
				iconComponent: { name: "" },
			},
			{
				name: "Consulta da Mulher",
				url: "/dashboard/consulta/mulher",
				iconComponent: { name: "" }
			},
			{
				name: "Consulta da Criança",
				url: "/dashboard/consulta/crianca",
				iconComponent: { name: "" }
			}
		]
	},
	{
		title: true,
		name: "USO INTERNO",
	},
	{
		name: "Cadastrar",
		url: "dashboard/cadastrar",
		iconComponent: { name: "cil-library-add" },
		children: [
			{
				name: "Mulher",
				url: "/dashboard/cadastrar/mulher",
				iconComponent: { name: "" },
			},
			{
				name: "Criança",
				url: "/dashboard/cadastrar/criança",
				iconComponent: { name: "" },
			},
			{
				name: "Profissional",
				url: "/dashboard/cadastrar/profissional",
				iconComponent: { name: "" },
			}
		],
	},
	{
		name: "Visualizar",
		url: "dashboard/visualizar",
		iconComponent: { name: "cil-magnifying-glass" },
		children: [
			{
				name: "Mulher",
				url: "/dashboard/visualizar/mulher",
				iconComponent: {name: ""},
			},
			{
				name: "Profissional",
				url: "/dashboard/visualizar/profissional",
				iconComponent: {name: ""}
			}
		],
	},
	{
		title: true,
		name: "SISTEMA",
	},
	{
		name: "Usuário",
		url: "dashboard/usuario",
		iconComponent: { name: "cil-contact" },
		children: [
			{
				name: "Adicionar",
				url: "/dashboard/usuario/novo",
				iconComponent: { name: "" },
			},
			{
				name: "Gerenciar",
				url: "/dashboard/usuario/visualizar",
				iconComponent: { name: "" },
			},
			{
				name: "Meus dados",
				url: "/dashboard/usuario/editar",
				iconComponent: { name: "" },
			},
		],
	},
];

// ##################################################################################################################
// ROLE_USER
// ##################################################################################################################

export const navItemsRoleUser: INavData[] = [
	{
		name: "Home",
		url: "/dashboard",
		iconComponent: { name: "cil-home" },
	},
	{
		title: true,
		name: "SISTEMA",
	},
	{
		name: "Usuário",
		url: "dashboard/usuario",
		iconComponent: { name: "cil-contact" },
		children: [
			{
				name: "Meus dados",
				url: "/dashboard/usuario/editar",
				iconComponent: { name: "" },
			},
		],
	},
];

// ##################################################################################################################
// ROLE_PROFESSIONAL
// ##################################################################################################################

export const navItemsRoleProfessional: INavData[] = [
	{
		name: "Início",
		url: "/dashboard",
		iconComponent: { name: "cil-home" },
	},
	{
		title: true,
		name: "ATENDIMENTO",
	},
	{
		name: "Serviços",
		url: "dashboard",
		iconComponent: { name: "cil-clipboard" },
		children: [
			{
				name: "Histórico da Mulher",
				url: "/dashboard/historico",
				iconComponent: { name: "" },
			},
			{
				name: "Consulta da Mulher",
				url: "/dashboard/consulta/mulher",
				iconComponent: { name: "" }
			},
			{
				name: "Consulta da Criança",
				url: "/dashboard/consulta/crianca",
				iconComponent: { name: "" }
			}
		]
	},
	{
		name: "Cadastrar",
		url: "dashboard/cadastrar",
		iconComponent: { name: "cil-library-add" },
		children: [
			{
				name: "Mulher",
				url: "/dashboard/cadastrar/mulher",
				iconComponent: { name: "" },
			},
			{
				name: "Criança",
				url: "/dashboard/cadastrar/criança",
				iconComponent: { name: "" },
			},
			{
				name: "Profissional",
				url: "/dashboard/cadastrar/profissional",
				iconComponent: { name: "" },
			}
		],
	},
	{
		name: "Visualizar",
		url: "dashboard/visualizar",
		iconComponent: { name: "cil-magnifying-glass" },
		children: [
			{
				name: "Mulher",
				url: "/dashboard/visualizar/mulher",
				iconComponent: {name: ""},
			},
			{
				name: "Profissional",
				url: "/dashboard/visualizar/profissional",
				iconComponent: {name: ""}
			}
		],
	},
	{
		title: true,
		name: "SISTEMA",
	},
	{
		name: "Usuário",
		url: "dashboard/usuario",
		iconComponent: { name: "cil-contact" },
		children: [
			{
				name: "Adicionar",
				url: "/dashboard/usuario/novo",
				iconComponent: { name: "" },
			},
			{
				name: "Meus dados",
				url: "/dashboard/usuario/editar",
				iconComponent: { name: "" },
			},
		],
	},
];

// ##################################################################################################################
// ROLE_RECEPTIONIST
// ##################################################################################################################

export const navItemsRoleReceptionist: INavData[] = [
	{
		name: "Início",
		url: "/dashboard",
		iconComponent: { name: "cil-home" },
	},
	{
		title: true,
		name: "USO INTERNO",
	},
	{
		name: "Cadastrar",
		url: "dashboard/cadastrar",
		iconComponent: { name: "cil-library-add" },
		children: [
			{
				name: "Mulher",
				url: "/dashboard/cadastrar/mulher",
				iconComponent: { name: "" },
			},
			{
				name: "Criança",
				url: "/dashboard/cadastrar/criança",
				iconComponent: { name: "" },
			},
			{
				name: "Profissional",
				url: "/dashboard/cadastrar/profissional",
				iconComponent: { name: "" },
			}
		],
	},
	{
		name: "Visualizar",
		url: "dashboard/visualizar",
		iconComponent: { name: "cil-magnifying-glass" },
		children: [
			{
				name: "Mulher",
				url: "/dashboard/visualizar/mulher",
				iconComponent: {name: ""},
			},
			{
				name: "Profissional",
				url: "/dashboard/visualizar/profissional",
				iconComponent: {name: ""}
			}
		],
	},
	{
		title: true,
		name: "SISTEMA",
	},
	{
		name: "Usuário",
		url: "dashboard/usuario",
		iconComponent: { name: "cil-contact" },
		children: [
			{
				name: "Adicionar",
				url: "/dashboard/usuario/novo",
				iconComponent: { name: "" },
			},
			{
				name: "Meus dados",
				url: "/dashboard/usuario/editar",
				iconComponent: { name: "" },
			},
		],
	},
];