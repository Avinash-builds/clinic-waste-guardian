import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { wasteData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are an expert biomedical waste management analyst. Analyze the provided waste data and provide actionable insights.

Format your response in clear sections:

**📊 Trend Analysis**
Analyze the waste generation trends and patterns.

**⚠️ Risk Assessment**
Identify any compliance or safety concerns.

**💡 Recommendations**
Provide 3-5 specific, actionable recommendations for improvement.

**🎯 Key Metrics**
Highlight the most important metrics and what they indicate.

Be concise but thorough. Focus on actionable insights that can improve waste management operations.`;

    const userPrompt = `Analyze this biomedical waste management data:

- Total Waste This Month: ${wasteData.totalWaste} kg
- Recycling Rate: ${wasteData.recyclingRate}%
- Cost Savings: $${wasteData.costSavings}
- Compliance Score: ${wasteData.complianceScore}%

Category Distribution:
- Yellow (Infectious): ${wasteData.categories.yellow}%
- Red (Contaminated Recyclables): ${wasteData.categories.red}%
- Blue (Pharmaceutical): ${wasteData.categories.blue}%
- White (Sharp Objects): ${wasteData.categories.white}%
- Sharps/Others: ${wasteData.categories.sharps}%

Provide insights on trends, potential issues, and recommendations for improvement.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded" }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required" }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(JSON.stringify({ error: "AI gateway error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (error) {
    console.error("Analytics insights error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
