import type { LocalizedNavbar, LocalizedSidebar } from '../../../i18n';
import type { VersionedEndpoints } from '../../../versioning';
import { basename, join, resolve } from 'node:path';
import { readdir } from 'node:fs/promises';
import { exists } from '../../../lib/fs';

const __version = basename(import.meta.filename, '.ts');
const __locale = basename(import.meta.dirname);
const __dirnameContent = resolve(import.meta.dirname, '..', '..', '..', 'content', 'docs', __locale);
const __dirnameVersionedContent = __version === 'latest' ? __dirnameContent : join(__dirnameContent, __version);
const __dirnameContentApi = resolve(__dirnameVersionedContent, 'api');

const apiVersions = (await readdir(__dirnameContentApi)).filter(n => n.startsWith('v'));

const endpointOrder: string[] = [
	'authentication.md',
	'server-info.md',
	'users.md',
	'players.md',
	'guilds.md',
	'server-variables.md',
	'chat.md',
	'logging.md',
	'admin-actions.md',
	'game-objects.md',
];

const endpointsByVersion = await Promise.all(apiVersions.map(async (versionName) => {
	const dirnameVersionEndpoints = resolve(__dirnameContentApi, versionName, 'endpoints');
	if (!await exists(dirnameVersionEndpoints)) {
		console.warn(`[apigen] Endpoints do not exist for ${__locale} ${versionName}`);
		return <VersionedEndpoints>[versionName, []];
	}

	const endpointFiles = await readdir(dirnameVersionEndpoints);
	const sortedEndpointFiles = endpointFiles.toSorted(
		(a, b) => {
			const aIndex = endpointOrder.indexOf(a);
			const bIndex = endpointOrder.indexOf(b);
			if (aIndex < 0) {
				if (bIndex < 0) {
					return a.localeCompare(b);
				}

				return 1;
			}

			if (bIndex < 0) {
				return -1;
			}

			if (aIndex !== bIndex) {
				return aIndex - bIndex;
			}

			return a.localeCompare(b);
		}
	);

	const endpointsForVersion: VersionedEndpoints = [versionName, sortedEndpointFiles];
	return endpointsForVersion;
}));

const apiEndpointsSidebarSection = endpointsByVersion.flatMap(
	([versionName, endpointFiles]) => endpointFiles.map(
		endpointFileName => `/api/${versionName}/endpoints/${endpointFileName}`
	)
);

export const navbar: LocalizedNavbar = [
	{
		title: 'Documentos do usuário',
		link: '/',
	},
	{
		title: 'Referência API',
		link: '/api/v1/',
	},
	{
		title: 'Guias do desenvolvedor',
		link: '/developer/',
	},
	{
		title: 'Comunidade de Apoio (Inglês)',
		link: 'https://www.ascensiongamedev.com/forum/53-questions-and-answers/',
	},
];

export const sidebar: LocalizedSidebar = {
	'/api/v1/': [
		{
			title: 'Informação API',
			collapsible: true,
			children: [
				'/api/v1/',
				'/api/v1/introduction/setup.md',
				'/api/v1/introduction/config.md',
				'/api/v1/introduction/roles.md',
			],
		},
		{
			title: 'Endpoints',
			collapsible: true,
			children: apiEndpointsSidebarSection,
		},
		{
			title: 'Avançado',
			collapsible: true,
			children: ['/api/v1/advanced/securing.md'],
		},
		{
			title: 'Tools',
			collapsible: true,
			children: ['/api/tools/hash-generators.mdx'],
		},
	],
	'/developer/': [
		{
			title: '<<todo:pt-BR>>Introduction',
			collapsible: true,
			children: ['/developer/'],
		},
		{
			title: 'Começando',
			collapsible: true,
			children: [
				'/developer/start/vs.md',
				'/developer/start/github.md',
				'/developer/start/compiling.md',
			],
		},
		{
			title: '<<todo:pt-BR>>Repository',
			collapsible: true,
			children: [
				'/developer/repository/',
				'/developer/repository/branches.md',
				'/developer/repository/file-structure.md',
				'/developer/repository/forking.md',
			],
		},
		{
			title: 'Fazendo mudanças',
			collapsible: true,
			children: [
				'/developer/modify/procedure.md',
				'/developer/modify/merging.md',
				'/developer/modify/conflicts.md',
			],
		},
		{
			title: 'Mantendo-se atualizado',
			collapsible: true,
			children: ['/developer/pullrequests/pulling.md'],
		},
		{
			title: 'Compartilhamento e contribuições',
			collapsible: true,
			children: [
				'/developer/sharing/creating.md',
				'/developer/sharing/applying.md',
				'/developer/sharing/contributing.md',
			],
		},
		{
			title: 'Avançado',
			collapsible: true,
			children: [
				'/developer/advanced/database.md',
				'/developer/advanced/packets.md',
				'/developer/advanced/eventcommands.md',
			],
		},
	],
	'/': [
		{
			title: 'Informações do Projeto',
			collapsible: true,
			children: ['/', '/project/about.md'],
		},
		{
			title: 'Começando',
			collapsible: true,
			children: [
				'/start/download.md',
				'/start/setup.md',
				'/start/login.md',
				'/start/overview.md',
			],
		},
		{
			title: 'Editores',
			collapsible: true,
			children: [
				'/design/animations.md',
				'/design/classes.md',
				'/design/conditions.md',
				'/design/crafting.md',
				'/design/items.md',
				'/design/lighting.md',
				'/design/mapping.md',
				'/design/npcs.md',
				'/design/projectiles.md',
				'/design/quests.md',
				'/design/resources.md',
				'/design/shops.md',
				'/design/spells.md',
				'/design/resources.md',
				'/design/time.md',
				'/design/world.md',
			],
		},
		{
			title: 'Eventos',
			collapsible: true,
			children: [
				'/events/introduction.md',
				'/events/commands.md',
				'/events/pages.md',
				'/events/common.md',
				'/events/examples.md',
			],
		},
		{
			title: 'Configuração',
			collapsible: true,
			children: [
				'/configuration/client-editor.md',
				'/configuration/server.md',
				'/configuration/server-database.md',
				'/configuration/server-security.md',
				'/configuration/equipment.md',
				{
					title: 'Avançado',
					collapsible: true,
					children: [
						'/advanced/assets.md',
						'/advanced/fonts.md',
						'/advanced/formulas.md',
						'/advanced/translations.md',
						'/advanced/interface.md',
						'/advanced/zdimensions.md',
						'/advanced/sizes.md',
						'/advanced/passwords.md',
					],
				},
			],
		},
		{
			title: 'Distribuição',
			collapsible: true,
			children: [
				'/deploy/forwarding.md',
				'/deploy/distributing.md',
				'/deploy/updater.md',
			],
		},
		{
			title: 'Atualizando',
			collapsible: true,
			children: ['/upgrade/upgrading.md'],
		},
	],
};
