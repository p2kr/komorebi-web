<script lang="ts">
	import { resolve } from "$app/paths";
	import { redirect } from "@sveltejs/kit";

	redirect(308, resolve("/dashboard"));
</script>
