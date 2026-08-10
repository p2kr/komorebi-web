<script lang="ts">
	import * as Breadcrumb from "$lib/components/ui/breadcrumb";
	import { SidebarTrigger } from "$lib/components/ui/sidebar";
</script>

<div class="flex items-center gap-4 mb-2">
	<SidebarTrigger />
	<Breadcrumb.Root>
		<Breadcrumb.List>
			<Breadcrumb.Item>Komorebi</Breadcrumb.Item>
			<Breadcrumb.Separator />
			<Breadcrumb.Item>Komorebi</Breadcrumb.Item>
		</Breadcrumb.List>
	</Breadcrumb.Root>
</div>
