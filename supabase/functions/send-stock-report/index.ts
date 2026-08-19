const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface StockLine {
  name: string;
  stockAnterior: number;
  entregado: number;
  restante: number;
  agregado: number;
  nuevoStock: number;
  unidad: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { to, mes, lines } = (await req.json()) as {
      to: string;
      mes: string;
      lines: StockLine[];
    };

    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "RESEND_API_KEY no configurada" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const rows = lines
      .map(
        (l) => `<tr>
          <td style="padding:6px 10px;border:1px solid #ddd">${l.name}</td>
          <td style="padding:6px 10px;border:1px solid #ddd;text-align:right">${l.stockAnterior}</td>
          <td style="padding:6px 10px;border:1px solid #ddd;text-align:right">${l.entregado}</td>
          <td style="padding:6px 10px;border:1px solid #ddd;text-align:right"><b>${l.restante}</b></td>
          <td style="padding:6px 10px;border:1px solid #ddd;text-align:right">${l.agregado}</td>
          <td style="padding:6px 10px;border:1px solid #ddd;text-align:right"><b>${l.nuevoStock}</b> ${l.unidad}</td>
        </tr>`,
      )
      .join("");

    const html = `
      <div style="font-family:Arial,Helvetica,sans-serif;color:#0d0e17">
        <h2 style="color:#0c11a1;margin-bottom:4px">Cierre de stock — ${mes}</h2>
        <p style="margin-top:0;color:#555">Actualización mensual de suministros / EPPs.</p>
        <table style="border-collapse:collapse;font-size:13px">
          <thead>
            <tr style="background:#f1f2f9">
              <th style="padding:6px 10px;border:1px solid #ddd;text-align:left">Suministro</th>
              <th style="padding:6px 10px;border:1px solid #ddd">Stock inicial</th>
              <th style="padding:6px 10px;border:1px solid #ddd">Entregado</th>
              <th style="padding:6px 10px;border:1px solid #ddd">Stock restante</th>
              <th style="padding:6px 10px;border:1px solid #ddd">Adicional</th>
              <th style="padding:6px 10px;border:1px solid #ddd">Nuevo stock</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Stock Suministros <onboarding@resend.dev>",
        to: [to],
        subject: `Stock restante del mes de ${mes}`,
        html,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      return new Response(JSON.stringify({ error: data }), {
        status: res.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ ok: true, data }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
