<script lang="ts">
	import { page } from "$app/state";

	const { mediaEntry } = page.state;
</script>

<pre>{JSON.stringify(mediaEntry, undefined, 2)}</pre>
