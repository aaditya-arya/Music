<?php if (!defined('ABSPATH')) exit; ?>
<div class="wrap aes-inbox">
    <header class="aes-inbox-header">
        <div><span class="aes-inbox-eyebrow">AES / REQUEST DESK</span><h1>Form submissions</h1><p>Every request. A clear next step.</p></div>
        <div class="aes-inbox-header-actions"><button type="button" class="aes-inbox-button secondary" id="aes-inbox-refresh"><span class="dashicons dashicons-update" aria-hidden="true"></span> Refresh</button><a class="aes-inbox-button primary" id="aes-inbox-export" href="#"><span class="dashicons dashicons-download" aria-hidden="true"></span> Export filtered CSV</a></div>
    </header>
    <div class="aes-inbox-metrics" aria-label="Inbox overview">
        <?php foreach (['total' => ['All requests', 'Your complete inbox'], 'open' => ['Needs attention', 'New and in progress'], 'unread' => ['Unread', 'Waiting for a first look'], 'resolved' => ['Resolved', 'Completed requests']] as $key => $metric): ?>
        <button type="button" class="aes-inbox-metric" data-metric="<?php echo esc_attr($key); ?>"><span><?php echo esc_html($metric[0]); ?></span><strong data-count="<?php echo esc_attr($key); ?>">—</strong><small><?php echo esc_html($metric[1]); ?></small></button>
        <?php endforeach; ?>
    </div>
    <div id="aes-inbox-notice" class="aes-inbox-notice" role="status" aria-live="polite" hidden></div>
    <section class="aes-inbox-workspace" aria-label="Manage submissions">
        <div class="aes-inbox-viewbar"><div class="aes-inbox-views" aria-label="Submission view"><button type="button" data-scope="inbox" aria-pressed="true">Inbox <span data-count="total">—</span></button><button type="button" data-scope="trash" aria-pressed="false">Trash <span data-count="trash">—</span></button></div><span id="aes-inbox-updated">Loading inbox…</span></div>
        <div class="aes-inbox-categories" aria-label="Request type"><button type="button" data-category="all" aria-pressed="true">All types</button><?php foreach (aes_inbox_categories() as $key => $label): ?><button type="button" data-category="<?php echo esc_attr($key); ?>" aria-pressed="false"><?php echo esc_html($label); ?> <span data-category-count="<?php echo esc_attr($key); ?>">—</span></button><?php endforeach; ?></div>
        <form id="aes-inbox-filters" class="aes-inbox-filters" role="search" aria-label="Filter submissions">
            <label class="aes-inbox-search">Search requests<input type="search" name="q" placeholder="Name, email, phone, reference or message…" autocomplete="off"></label>
            <label>Status<select name="status"><option value="all">All statuses</option><option value="open">Needs attention</option><?php foreach (aes_inbox_statuses() as $key => $label): ?><option value="<?php echo esc_attr($key); ?>"><?php echo esc_html($label); ?></option><?php endforeach; ?></select></label>
            <label>From<input type="date" name="from"></label><label>To<input type="date" name="to"></label>
            <label class="aes-inbox-unread"><input type="checkbox" name="unread" value="1"> Unread only</label><button type="button" class="aes-inbox-text-button" id="aes-inbox-reset">Reset filters</button>
        </form>
        <div class="aes-inbox-listbar"><span id="aes-inbox-results" role="status" aria-live="polite">Loading requests…</span><div><label>Sort <select id="aes-inbox-sort" aria-label="Sort requests"><option value="newest">Newest first</option><option value="oldest">Oldest first</option></select></label><label>Show <select id="aes-inbox-size" aria-label="Requests per page"><option>20</option><option>50</option><option>100</option></select></label></div></div>
        <div class="aes-inbox-bulk" id="aes-inbox-bulk" hidden><strong id="aes-inbox-selected">0 selected</strong><select id="aes-inbox-bulk-action" aria-label="Bulk action"></select><button type="button" class="aes-inbox-button primary" id="aes-inbox-apply">Apply</button><button type="button" class="aes-inbox-button" id="aes-inbox-export-selected">Export selected</button><button type="button" class="aes-inbox-text-button" id="aes-inbox-clear">Clear selection</button></div>
        <div class="aes-inbox-table-wrap"><table class="aes-inbox-table" id="aes-inbox-table"><caption class="screen-reader-text">Website form submissions. Open a request to see all fields and manage follow-up.</caption><thead><tr><td class="aes-inbox-check"><input type="checkbox" id="aes-inbox-check-all" aria-label="Select all requests on this page"></td><th scope="col">Request / received</th><th scope="col">Contact</th><th scope="col">Request summary</th><th scope="col">Status</th><th scope="col">Files</th><th scope="col"><span class="screen-reader-text">Actions</span></th></tr></thead><tbody id="aes-inbox-rows"></tbody></table></div>
        <div id="aes-inbox-empty" class="aes-inbox-empty" hidden><span class="dashicons dashicons-email-alt" aria-hidden="true"></span><h2 id="aes-inbox-empty-title">Your inbox is ready</h2><p id="aes-inbox-empty-copy">New website submissions will appear here. Use Refresh to check for updates.</p></div>
        <footer class="aes-inbox-footer"><p>Times shown in <?php echo esc_html(wp_timezone_string()); ?>. Updates every minute while this inbox is open.</p><nav aria-label="Submission pages"><button type="button" class="aes-inbox-button" id="aes-inbox-prev">← Previous</button><span id="aes-inbox-page">Page 1 of 1</span><button type="button" class="aes-inbox-button" id="aes-inbox-next">Next →</button></nav></footer>
    </section>
    <p class="aes-inbox-help">Open a request to review its complete message and attachments, record a private note, and track its progress. Trash is recoverable until WordPress removes it automatically.</p>
</div>
<div class="aes-inbox-overlay" id="aes-inbox-overlay" hidden>
    <section class="aes-inbox-drawer" id="aes-inbox-detail" role="dialog" aria-modal="true" aria-labelledby="aes-detail-title" tabindex="-1">
        <header><div><span class="aes-inbox-eyebrow" id="aes-detail-reference">REQUEST DETAILS</span><h2 id="aes-detail-title">Request details</h2><p id="aes-detail-date"></p></div><button type="button" class="aes-inbox-close" id="aes-detail-close" aria-label="Close request details">×</button></header>
        <div class="aes-inbox-detail-body"><div id="aes-detail-notice" class="aes-inbox-notice" role="status" aria-live="polite" hidden></div><div id="aes-detail-content"></div></div>
        <footer id="aes-detail-footer" hidden><span id="aes-detail-save-state">Changes are private to administrators.</span><div class="aes-inbox-footer-actions"><button type="button" class="aes-inbox-button" id="aes-detail-discard" hidden>Discard</button><button type="button" class="aes-inbox-button primary" id="aes-detail-save">Save changes</button></div></footer>
    </section>
</div>
