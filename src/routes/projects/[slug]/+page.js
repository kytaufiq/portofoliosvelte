import { getProjectBySlug } from '$lib/projectsData.js';
import { error } from '@sveltejs/kit';

export function load({ params }) {
    const project = getProjectBySlug(params.slug);

    if (!project) {
        throw error(404, 'Project not found');
    }

    return {
        project
    };
}
