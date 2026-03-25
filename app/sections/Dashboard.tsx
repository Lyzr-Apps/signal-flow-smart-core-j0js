'use client'

import React, { useMemo } from 'react'
import { RiTimeLine, RiFlashlightLine, RiLineChartLine, RiAlertLine, RiArrowRightUpLine, RiShieldLine, RiRocketLine, RiErrorWarningLine, RiFileTextLine, RiArrowRightSLine } from 'react-icons/ri'
import type { DetailItem } from './DetailView'

interface AnalysisItem {
  _id?: string
  signal_id?: string
  orchestrator_summary?: string
  specialist_outputs?: any[]
  signal_types?: string[]
  priority_actions?: any[]
  cross_cutting_themes?: string
  createdAt?: string
}

interface DashboardProps {
  analyses: AnalysisItem[]
  loading: boolean
  onNavigate: (view: string) => void
  onViewAnalysis: (analysis: AnalysisItem) => void
  onOpenDetail: (item: DetailItem) => void
}

// ────────────────────────────────────────────────────────────────────────────
// Seeded beauty foresight scenarios
// These serve as initial intelligence until real analyses replace them.
// Each scenario populates exactly the section(s) it belongs to.
// ────────────────────────────────────────────────────────────────────────────

interface SeededSignal { id: string; title: string; brand: string; market: string; urgency: string; why: string; nextStep: string; crossCutting: string; detailSections: { label: string; content: string }[]; relatedActions: { action: string; priority: string; owner: string; rationale: string }[]; timestamp: string }
interface SeededAction { title: string; priority: string; owner: string; impact: string; timeline: string; scenarioId: string }
interface SeededOpportunity { title: string; brand: string; market: string; why: string; confidence: string; move: string; scenarioId: string; detailSections: { label: string; content: string }[]; relatedActions: { action: string; priority: string; owner: string; rationale: string }[] }
interface SeededRisk { title: string; brand: string; market: string; severity: string; cause: string; action: string; scenarioId: string; detailSections: { label: string; content: string }[]; relatedActions: { action: string; priority: string; owner: string; rationale: string }[] }
interface SeededAlert { title: string; brand: string; market: string; severity: string; why: string; response: string; scenarioId: string; detailSections: { label: string; content: string }[]; relatedActions: { action: string; priority: string; owner: string; rationale: string }[] }
interface SeededAnalysis { id: string; title: string; brand: string; market: string; signalTypes: string[]; summary: string; timestamp: string; scenarioId: string }

// ── Priority Signals ──
const SEEDED_SIGNALS: SeededSignal[] = [
  {
    id: 's1', title: 'Peptide Scalp-Care Opportunity Emerging in Southeast Asia', brand: 'Garnier / Kérastase', market: 'Southeast Asia', urgency: 'High',
    why: 'Search volume for "peptide scalp serum" is up 280% QoQ in SEA. Social discussion centres on scalp barrier health among 18-34 consumers. Current offerings are fragmented with no category leader. First-mover advantage is available.',
    nextStep: 'Commission consumer research in Indonesia and Thailand to validate demand sizing and price sensitivity',
    crossCutting: 'Preventive hair wellness is an emerging behaviour shift that connects scalp health, active ingredients, and self-care culture.',
    timestamp: '2026-03-24T08:45:00Z',
    detailSections: [
      { label: 'Signal Context', content: 'Search and social discussion around scalp barrier health and peptide-based scalp serums is rising in Southeast Asia, especially among younger consumers seeking preventive hair wellness routines. Current offerings are fragmented and education is still limited.' },
      { label: 'Why It Matters', content: 'This represents a whitespace opportunity where no major brand owns the category narrative. Consumer behaviour is shifting from reactive hair repair to preventive scalp wellness, and peptide-based formulations are the emerging science story driving interest.' },
      { label: 'Market Intelligence', content: 'Google Trends data shows "scalp serum" search volume up 280% QoQ in Indonesia, Philippines, and Thailand. TikTok and Instagram Reels content around scalp-care routines is generating 3-5x higher engagement than traditional hair-care content in the region.' },
      { label: 'Recommended Next Step', content: 'Commission consumer research in Indonesia and Thailand to validate demand sizing and price sensitivity. Evaluate existing Kérastase and Garnier scalp-care formulations for SEA market adaptation.' },
    ],
    relatedActions: [
      { action: 'Commission scalp-care consumer research in SEA', priority: 'High', owner: 'Consumer Insights APAC', rationale: 'Validate market size and consumer willingness to pay before product development' },
      { action: 'Evaluate peptide scalp serum formulation pipeline', priority: 'High', owner: 'R&D Hair Care', rationale: 'Determine time-to-market for peptide-based scalp product' },
      { action: 'Map competitive landscape in SEA scalp-care', priority: 'Medium', owner: 'Strategy APAC', rationale: 'Identify gaps and positioning opportunities before committing resources' },
    ],
  },
  {
    id: 's2', title: 'Competitor Capturing Early SOV in UK Brightening Serums', brand: "L'Oréal Paris", market: 'United Kingdom', urgency: 'Critical',
    why: 'A competitor has launched a vitamin C brightening serum with strong creator seeding and dermatologist endorsements ahead of our planned Q2 activation. Search interest is consolidating around competitor claims. Our share of voice has dropped 18 points in 4 weeks.',
    nextStep: 'Accelerate UK brightening serum launch timeline and activate counter-narrative with owned clinical data',
    crossCutting: 'Speed of competitive response in creator-led categories determines long-term SOV positioning.',
    timestamp: '2026-03-23T14:20:00Z',
    detailSections: [
      { label: 'Signal Context', content: 'A competitor has launched a vitamin C brightening serum in the UK with strong creator seeding, dermatologist-led content, and retail placement ahead of our planned activation. Search and social attention are consolidating around the competitor claims.' },
      { label: 'Competitive Threat Assessment', content: 'Competitor SOV in "brightening serum UK" search cluster has risen from 12% to 38% in 4 weeks. Their creator programme includes 40+ dermatology and skincare influencers. Retail placement includes Boots premium endcap and Space NK feature wall.' },
      { label: 'Impact on L\'Oréal Paris', content: 'Our planned Q2 UK brightening serum launch is at risk of entering a market where competitor claims are already established. Without counter-positioning, our launch will appear reactive rather than innovative.' },
      { label: 'Recommended Response', content: 'Accelerate UK launch timeline by 3-4 weeks. Activate proprietary clinical trial data as a differentiation lever. Engage UK-based dermatologists for counter-narrative content before competitor narrative solidifies.' },
    ],
    relatedActions: [
      { action: 'Accelerate UK brightening serum launch by 3-4 weeks', priority: 'Critical', owner: 'Brand Management UK', rationale: 'Prevent competitor from solidifying category ownership' },
      { action: 'Activate clinical data counter-narrative programme', priority: 'Critical', owner: 'Medical Affairs / PR', rationale: 'Differentiate on clinical evidence vs. competitor creator-led claims' },
      { action: 'Secure Boots premium placement for launch week', priority: 'High', owner: 'Commercial UK', rationale: 'Match competitor retail visibility' },
    ],
  },
  {
    id: 's5', title: 'Exosome Skincare Interest Accelerating in Premium Anti-Aging', brand: 'Lancôme / Helena Rubinstein', market: 'South Korea / US / Europe', urgency: 'High',
    why: 'Search and creator discussion around exosome-based skincare is accelerating among premium consumers. The narrative centres on advanced repair and regeneration, but consumer understanding is early and fragmented. Early movers will own the science story.',
    nextStep: 'Evaluate exosome technology integration into Lancôme Advanced Génifique pipeline and commission regulatory feasibility review',
    crossCutting: 'Exosome technology bridges biotech and beauty in ways that could redefine premium anti-aging positioning.',
    timestamp: '2026-03-22T11:30:00Z',
    detailSections: [
      { label: 'Signal Context', content: 'Search, social, and creator discussion around exosome-based skincare is accelerating among premium skincare consumers, especially in South Korea, the US, and selective European markets. Interest is being driven by advanced repair and regeneration narratives, but consumer understanding is still early and fragmented.' },
      { label: 'Opportunity Assessment', content: 'Exosome skincare represents the next frontier in biotech beauty. South Korean brands are first to market but primarily in clinical channels. No global luxury brand has claimed the exosome narrative in mainstream premium skincare.' },
      { label: 'Strategic Fit', content: 'Lancôme Advanced Génifique and Helena Rubinstein Prodigy lines are well positioned to integrate exosome technology. Both brands have established science-led positioning that would benefit from next-generation biotech ingredients.' },
      { label: 'Recommended Next Step', content: 'Evaluate exosome technology integration into Advanced Génifique pipeline. Commission regulatory feasibility review for EU, US, and China markets. Begin science communication groundwork with key dermatology KOLs.' },
    ],
    relatedActions: [
      { action: 'Evaluate exosome technology for Génifique pipeline', priority: 'High', owner: 'R&D Skincare Innovation', rationale: 'First global luxury brand to market with exosome claims will define category' },
      { action: 'Commission multi-market regulatory feasibility review', priority: 'High', owner: 'Regulatory Affairs', rationale: 'Exosome claims require careful navigation across regulatory frameworks' },
      { action: 'Begin KOL science communication programme', priority: 'Medium', owner: 'Medical Affairs', rationale: 'Build credibility infrastructure before product launch' },
    ],
  },
]

// ── Active Opportunities ──
const SEEDED_OPPORTUNITIES: SeededOpportunity[] = [
  {
    title: 'Peptide Scalp-Care Category Leadership in SEA', brand: 'Garnier / Kérastase', market: 'Southeast Asia', confidence: 'High',
    why: 'No category leader exists in peptide scalp-care in SEA. Consumer search and social signals show strong and growing demand. The preventive hair wellness positioning aligns with regional self-care trends among 18-34 consumers.',
    move: 'Fast-track peptide scalp serum development with SEA-specific formulation. Target Q4 2026 launch in Indonesia and Thailand with creator-led education campaign.',
    scenarioId: 's1',
    detailSections: [
      { label: 'Opportunity Overview', content: 'Peptide scalp-care is an emerging category with no established leader in Southeast Asia. Consumer interest is driven by the shift from reactive hair repair to preventive scalp wellness, creating a whitespace opportunity for brands with strong ingredient science credentials.' },
      { label: 'Market Sizing', content: 'The SEA scalp-care market is estimated at $340M and growing at 18% CAGR. Peptide-based products represent less than 5% of current offerings, indicating significant upside for early entrants with credible formulations.' },
      { label: 'Competitive Landscape', content: 'Current offerings are fragmented across local brands and K-beauty imports. No global brand has established a dominant position. Kérastase has existing scalp-care credibility that can be leveraged, while Garnier provides mass-market reach.' },
    ],
    relatedActions: [
      { action: 'Fast-track peptide scalp serum for SEA', priority: 'High', owner: 'R&D Hair Care', rationale: 'First-mover advantage in category with no established leader' },
      { action: 'Develop creator-led scalp education campaign', priority: 'High', owner: 'Digital Marketing APAC', rationale: 'Education is key — consumers are interested but knowledge is limited' },
    ],
  },
  {
    title: 'Ectoin Barrier-Support Positioning in Sensitive Skincare', brand: 'La Roche-Posay / CeraVe', market: 'Global', confidence: 'Medium',
    why: 'Consumer and creator interest in ectoin is rising as barrier-repair remains important. A small number of brands are framing ectoin as science-forward for calming and environmental stress defense. La Roche-Posay and CeraVe have strong barrier-care positioning to leverage.',
    move: 'Develop ectoin-enhanced formulation for existing barrier-care ranges. Position as next-generation ingredient story within established product lines rather than standalone launch.',
    scenarioId: 's6',
    detailSections: [
      { label: 'Opportunity Overview', content: 'Ectoin is gaining traction as a barrier-support ingredient. Consumer and creator interest is rising as barrier-repair and skin resilience remain important in sensitive-skin routines. A small number of beauty brands are beginning to frame ectoin as a science-forward ingredient in calming and environmental stress defense.' },
      { label: 'Strategic Fit', content: 'La Roche-Posay Toleriane and CeraVe barrier ranges are natural homes for ectoin integration. Both brands have credibility in dermatologist-recommended skincare, making the ingredient story additive rather than disruptive.' },
      { label: 'Competitive Window', content: 'Ectoin awareness is still early. Two indie brands have launched ectoin products but lack the distribution and credibility of L\'Oréal portfolio brands. The window to own the ectoin narrative in mainstream dermocosmetics is 12-18 months.' },
    ],
    relatedActions: [
      { action: 'Evaluate ectoin formulation for Toleriane range', priority: 'Medium', owner: 'R&D Active Cosmetics', rationale: 'Leverage existing barrier-care positioning with next-gen ingredient' },
      { action: 'Develop ectoin ingredient education content', priority: 'Medium', owner: 'Medical Marketing', rationale: 'Build consumer understanding before competitor narrative forms' },
    ],
  },
  {
    title: 'Copper Peptide Longevity Positioning in Premium Skincare', brand: 'Helena Rubinstein / Lancôme', market: 'Global Premium', confidence: 'Medium',
    why: 'Copper peptides are re-emerging in premium conversations linked to skin longevity and healthy aging. The framing is becoming more sophisticated and science-led, moving beyond repair to regeneration and cellular health narratives.',
    move: 'Develop copper peptide integration roadmap for Helena Rubinstein Prodigy line. Position as longevity-science ingredient rather than traditional repair.',
    scenarioId: 's9',
    detailSections: [
      { label: 'Opportunity Overview', content: 'Copper peptides are reappearing in premium skincare conversations, now linked not only to repair but also to skin longevity and healthy aging narratives. Interest is still niche, but the framing is becoming more sophisticated and science-led.' },
      { label: 'Consumer Insight', content: 'Premium skincare consumers aged 35-55 are increasingly interested in longevity-positioned products. Copper peptides offer a credible science story that bridges traditional anti-aging with the emerging longevity and cellular health positioning.' },
      { label: 'Competitive Landscape', content: 'No major luxury brand has claimed copper peptides in a longevity context. Several indie brands are experimenting but lack the R&D depth and distribution to scale. This is an open positioning opportunity.' },
    ],
    relatedActions: [
      { action: 'Develop copper peptide integration for Prodigy line', priority: 'Medium', owner: 'R&D Premium Skincare', rationale: 'Leverage longevity trend with credible science-backed ingredient' },
      { action: 'Commission longevity positioning research', priority: 'Low', owner: 'Consumer Insights', rationale: 'Validate longevity framing resonance with target consumers' },
    ],
  },
]

// ── Launch Risks ──
const SEEDED_RISKS: SeededRisk[] = [
  {
    title: 'Hair Repair Launch Underperforming in Germany E-Commerce', brand: "L'Oréal Paris Hair", market: 'Germany', severity: 'High',
    cause: 'Product page traffic is healthy but conversion is low. Reviews show confusion around benefit differentiation vs. existing repair products. Creator support is limited and organic social engagement is below benchmark.',
    action: 'Conduct rapid UX audit of product page. Rebrief creator programme with clearer benefit messaging. Test A/B product page copy emphasising unique differentiation.',
    scenarioId: 's3',
    detailSections: [
      { label: 'Risk Context', content: 'A newly launched hair repair product is seeing weaker-than-expected traction in Germany. Product page traffic is healthy, but conversion is low, reviews show confusion around benefit differentiation, and creator support is limited.' },
      { label: 'Performance Data', content: 'Product page visits are at 85% of target, but add-to-cart rate is 2.1% vs. 4.8% benchmark. Early reviews (62 total) show 3.2/5 average rating with recurring themes of "not sure how this is different" and "expected more visible results." Creator-generated content volume is at 30% of plan.' },
      { label: 'Root Cause Assessment', content: 'Three contributing factors: (1) Benefit messaging on product page does not clearly differentiate from existing L\'Oréal repair range, (2) Creator briefs were generic and did not equip creators to demonstrate unique benefits, (3) Price point creates expectation gap — consumers expect premium results but messaging is functional.' },
      { label: 'Recommended Response', content: 'Conduct rapid UX audit of product page. Rebrief creator programme with clearer differentiation messaging and before/after demonstration protocols. Consider limited-time trial pricing to drive initial conversion and review volume.' },
    ],
    relatedActions: [
      { action: 'Conduct rapid e-commerce UX audit', priority: 'High', owner: 'Digital Commerce Germany', rationale: 'Low conversion despite healthy traffic indicates product page issues' },
      { action: 'Rebrief creator programme with differentiation messaging', priority: 'High', owner: 'Influencer Marketing', rationale: 'Current creator content lacks benefit clarity' },
      { action: 'Test A/B product page copy variations', priority: 'Medium', owner: 'E-Commerce Team', rationale: 'Validate which benefit messaging drives conversion' },
    ],
  },
  {
    title: 'Peptide Eye-Care Launch Facing Narrative Crowding', brand: "L'Oréal Paris / Lancôme", market: 'Global', severity: 'High',
    cause: 'Competitor brands have intensified messaging around collagen support, firming, and wrinkle reduction using overlapping peptide language. Early social content suggests category crowding and weak differentiation for our planned launch.',
    action: 'Reposition launch messaging away from generic peptide claims toward proprietary technology narrative. Delay launch by 2-3 weeks to refine creative and PR strategy.',
    scenarioId: 's7',
    detailSections: [
      { label: 'Risk Context', content: 'L\'Oréal is preparing to launch a peptide eye-care product, but competitor brands have already intensified messaging around collagen support, firming, and visible wrinkle reduction using overlapping peptide language. Early social content suggests the category is getting crowded and differentiation may be weak.' },
      { label: 'Competitive Noise Assessment', content: 'In the past 8 weeks, three competitor brands have launched or announced peptide eye-care products. Total social mentions of "peptide eye cream" are up 420%, but sentiment analysis shows growing consumer confusion about ingredient differentiation.' },
      { label: 'Differentiation Gap', content: 'Current launch messaging relies on "peptide complex for eye area" which overlaps directly with competitor claims. Internal clinical data shows superior results on dark circles and puffiness, but this is not reflected in planned launch communications.' },
      { label: 'Recommended Response', content: 'Reposition launch messaging away from generic peptide claims toward proprietary technology narrative. Leverage clinical data on dark circles and puffiness as differentiation. Consider delaying launch by 2-3 weeks to refine creative and PR strategy.' },
    ],
    relatedActions: [
      { action: 'Reposition peptide eye-care launch messaging', priority: 'High', owner: 'Brand Strategy', rationale: 'Generic peptide claims will not cut through current competitive noise' },
      { action: 'Activate clinical differentiation data in launch comms', priority: 'High', owner: 'Medical Affairs / PR', rationale: 'Proprietary clinical results are the strongest differentiation lever' },
      { action: 'Evaluate launch timeline adjustment (2-3 weeks)', priority: 'Medium', owner: 'Brand Management', rationale: 'Better to launch with strong differentiation than rush into a crowded narrative' },
    ],
  },
]

// ── Claims / Reputation Alerts ──
const SEEDED_ALERTS: SeededAlert[] = [
  {
    title: 'Retinol Irritation Concern Building in France', brand: 'La Roche-Posay / Vichy', market: 'France', severity: 'Critical',
    why: 'Review and social chatter show rising concern around irritation and improper use of a retinol product. No formal safety issue is confirmed, but consumer interpretation is turning negative and usage guidance appears insufficient.',
    response: 'Issue updated usage guidance with dermatologist-backed education. Proactively address concerns through owned channels before media picks up the narrative.',
    scenarioId: 's4',
    detailSections: [
      { label: 'Alert Context', content: 'Review and social chatter in France show rising concern around irritation and improper use of a retinol product. No formal safety issue is confirmed, but consumer interpretation is turning negative and usage guidance appears insufficient.' },
      { label: 'Sentiment Analysis', content: 'Negative sentiment around retinol irritation has increased 340% in French social channels over 6 weeks. Key themes: "too strong for daily use," "burned my skin," "no instructions on how to start." 23% of recent product reviews mention irritation. Beauty forum discussions are amplifying individual negative experiences.' },
      { label: 'Risk Assessment', content: 'While no pharmacovigilance signal has been confirmed, the consumer perception risk is significant. If a French health influencer or media outlet picks up the narrative, it could impact the broader retinol portfolio. The core issue is insufficient usage education, not product safety.' },
      { label: 'Recommended Response', content: 'Issue updated usage guidance with dermatologist-backed content emphasising gradual introduction protocol. Proactively address concerns through owned social channels. Brief customer service teams on talking points. Monitor for any escalation that would require formal communication.' },
    ],
    relatedActions: [
      { action: 'Issue updated retinol usage guidance in France', priority: 'Critical', owner: 'Medical Affairs France', rationale: 'Proactive education is essential before narrative escalates' },
      { action: 'Activate dermatologist-backed content on owned channels', priority: 'Critical', owner: 'Digital Marketing France', rationale: 'Counter negative UGC with authoritative usage guidance' },
      { action: 'Brief customer service teams on retinol talking points', priority: 'High', owner: 'Consumer Relations', rationale: 'Ensure consistent and reassuring response to consumer inquiries' },
    ],
  },
  {
    title: 'Spicule Ingredient Concern Creating Consumer Hesitation', brand: 'Cross-brand / Market-wide', market: 'Global', severity: 'High',
    why: 'Social discussion around spicule-based skincare is growing, but concerns about irritation, overuse, and safety are intensifying. Some creators are amplifying strong visible reactions without education or nuance. This could impact ingredient confidence broadly.',
    response: 'Monitor spicule sentiment closely. If L\'Oréal portfolio includes or is considering spicule ingredients, prepare proactive safety communication. Engage dermatology KOLs to provide balanced perspective.',
    scenarioId: 's8',
    detailSections: [
      { label: 'Alert Context', content: 'Social discussion around spicule-based skincare is growing, but so are concerns about irritation, overuse, and whether consumers understand how to use the ingredient safely. Some creators are amplifying strong visible reactions without enough education or nuance.' },
      { label: 'Consumer Sentiment', content: 'Spicule-related content is generating high engagement but increasingly polarised sentiment. "Spicule skincare reaction" and "spicule burn" are trending search queries. Several viral videos show extreme skin reactions presented without proper context about expected vs. adverse outcomes.' },
      { label: 'Portfolio Implications', content: 'Even if L\'Oréal does not currently use spicule ingredients, the broader narrative could affect consumer confidence in "active" or "clinical-strength" skincare ingredients across the portfolio. There is also risk if any future pipeline products include spicule-adjacent technologies.' },
      { label: 'Recommended Response', content: 'Monitor spicule sentiment across markets. Prepare proactive safety communication framework in case the narrative broadens to active ingredients generally. Engage dermatology KOLs to provide balanced perspective on ingredient safety and proper usage.' },
    ],
    relatedActions: [
      { action: 'Establish spicule sentiment monitoring dashboard', priority: 'High', owner: 'Social Listening Team', rationale: 'Early warning if narrative spreads to adjacent ingredients or brands' },
      { action: 'Prepare proactive ingredient safety communication', priority: 'Medium', owner: 'Corporate Communications', rationale: 'Ready-to-deploy messaging if media inquiry or viral escalation occurs' },
      { action: 'Engage dermatology KOLs for balanced perspective', priority: 'Medium', owner: 'Medical Affairs', rationale: 'Authoritative voices can counter uninformed creator content' },
    ],
  },
]

// ── Recommended Actions (consolidated from all scenarios) ──
const SEEDED_ACTIONS: SeededAction[] = [
  { title: 'Issue updated retinol usage guidance in France', priority: 'Critical', owner: 'Medical Affairs France', impact: 'Prevents consumer perception crisis around retinol safety before media amplification', timeline: 'Immediate', scenarioId: 's4' },
  { title: 'Accelerate UK brightening serum launch by 3-4 weeks', priority: 'Critical', owner: 'Brand Management UK', impact: 'Prevents competitor from solidifying category ownership in brightening serums', timeline: '3-4 weeks', scenarioId: 's2' },
  { title: 'Commission scalp-care consumer research in SEA', priority: 'High', owner: 'Consumer Insights APAC', impact: 'Validates market sizing for peptide scalp-care opportunity before product development', timeline: '6-8 weeks', scenarioId: 's1' },
  { title: 'Conduct rapid e-commerce UX audit for Germany hair repair', priority: 'High', owner: 'Digital Commerce Germany', impact: 'Addresses low conversion despite healthy traffic on underperforming launch', timeline: '2 weeks', scenarioId: 's3' },
  { title: 'Reposition peptide eye-care launch messaging', priority: 'High', owner: 'Brand Strategy', impact: 'Ensures differentiation in crowded peptide eye-care narrative', timeline: 'Before launch', scenarioId: 's7' },
  { title: 'Evaluate exosome technology for Génifique pipeline', priority: 'High', owner: 'R&D Skincare Innovation', impact: 'First global luxury brand to market with exosome positioning defines the category', timeline: 'Q3 2026 review', scenarioId: 's5' },
  { title: 'Evaluate ectoin formulation for Toleriane range', priority: 'Medium', owner: 'R&D Active Cosmetics', impact: 'Leverages existing barrier-care positioning with next-gen ingredient story', timeline: '12-18 months', scenarioId: 's6' },
  { title: 'Develop copper peptide integration for Prodigy line', priority: 'Medium', owner: 'R&D Premium Skincare', impact: 'Captures longevity positioning in premium anti-aging before competitors', timeline: '2027 pipeline', scenarioId: 's9' },
]

// ── Recent Analyses (seeded summaries) ──
const SEEDED_ANALYSES: SeededAnalysis[] = [
  { id: 'sa1', title: 'Peptide Scalp-Care Opportunity Assessment', brand: 'Garnier / Kérastase', market: 'Southeast Asia', signalTypes: ['Opportunity', 'Consumer Insight'], summary: 'Identified emerging peptide scalp-care whitespace in SEA with no category leader. Consumer demand is driven by preventive wellness behaviour among 18-34 demographic. Recommended commissioning consumer research and evaluating formulation pipeline.', timestamp: '2026-03-24T08:45:00Z', scenarioId: 's1' },
  { id: 'sa2', title: 'UK Brightening Serum Competitive Response', brand: "L'Oréal Paris", market: 'United Kingdom', signalTypes: ['Competitive', 'Launch'], summary: 'Competitor has captured early SOV in UK brightening serums. Recommended accelerating launch timeline and activating clinical data counter-narrative programme to prevent competitor from solidifying category ownership.', timestamp: '2026-03-23T14:20:00Z', scenarioId: 's2' },
  { id: 'sa3', title: 'Germany Hair Repair Launch Performance Review', brand: "L'Oréal Paris Hair", market: 'Germany', signalTypes: ['Launch', 'Performance'], summary: 'Hair repair product underperforming in German e-commerce. Root causes: weak benefit differentiation, insufficient creator support, and product page messaging gap. Recommended UX audit and creator rebrief.', timestamp: '2026-03-22T16:10:00Z', scenarioId: 's3' },
  { id: 'sa4', title: 'France Retinol Irritation Sentiment Analysis', brand: 'La Roche-Posay / Vichy', market: 'France', signalTypes: ['Claims', 'Reputation'], summary: 'Rising negative sentiment around retinol irritation in France. No safety signal confirmed, but consumer perception requires proactive management. Recommended issuing updated usage guidance and dermatologist-backed education content.', timestamp: '2026-03-22T11:30:00Z', scenarioId: 's4' },
  { id: 'sa5', title: 'Exosome Skincare Strategic Assessment', brand: 'Lancôme / Helena Rubinstein', market: 'Global Premium', signalTypes: ['Opportunity', 'Innovation'], summary: 'Exosome technology represents the next frontier in biotech beauty. No global luxury brand has claimed the narrative. Recommended evaluating integration into Génifique pipeline and beginning KOL science communication groundwork.', timestamp: '2026-03-21T09:00:00Z', scenarioId: 's5' },
  { id: 'sa6', title: 'Peptide Eye-Care Launch Positioning Review', brand: "L'Oréal Paris / Lancôme", market: 'Global', signalTypes: ['Launch', 'Competitive'], summary: 'Peptide eye-care category is experiencing narrative crowding. Three competitor launches in 8 weeks have saturated generic peptide claims. Recommended repositioning toward proprietary technology narrative and leveraging clinical differentiation data.', timestamp: '2026-03-20T15:30:00Z', scenarioId: 's7' },
]

// ── Helpers ──

function urgencyBadge(urgency: string) {
  const u = (urgency || '').toLowerCase()
  if (u === 'critical') return 'bg-red-500/15 text-red-400 border border-red-500/30'
  if (u === 'high') return 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
  if (u === 'medium') return 'bg-blue-400/15 text-blue-400 border border-blue-400/30'
  return 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
}

function severityDot(sev: string) {
  const s = (sev || '').toLowerCase()
  if (s === 'critical') return 'bg-red-500'
  if (s === 'high') return 'bg-amber-500'
  if (s === 'medium') return 'bg-blue-400'
  return 'bg-emerald-500'
}

function cleanText(text: string, maxLen = 90): string {
  if (!text) return ''
  const clean = text.replace(/\*\*/g, '').replace(/[#]/g, '').replace(/\n/g, ' ').trim()
  return clean.length > maxLen ? clean.slice(0, maxLen) + '...' : clean
}

function priorityOrder(p: string): number {
  const v = (p || '').toLowerCase()
  if (v === 'critical') return 0
  if (v === 'high') return 1
  if (v === 'medium') return 2
  return 3
}

// ── Derive dynamic intelligence from real analyses ──

function deriveFromAnalyses(analyses: AnalysisItem[]) {
  const signals: SeededSignal[] = []
  const actions: SeededAction[] = []
  const opportunities: SeededOpportunity[] = []
  const risks: SeededRisk[] = []
  const alerts: SeededAlert[] = []
  const recentAnalyses: SeededAnalysis[] = []

  for (const a of analyses) {
    const types = Array.isArray(a.signal_types) ? a.signal_types.map(t => (t || '').toLowerCase()) : []
    const specialists = Array.isArray(a.specialist_outputs) ? a.specialist_outputs : []
    const pActions = Array.isArray(a.priority_actions) ? a.priority_actions : []
    const summary = a.orchestrator_summary || ''
    const id = a._id || ''

    recentAnalyses.push({
      id, title: cleanText(summary, 60), brand: 'Analysis', market: 'See details', signalTypes: Array.isArray(a.signal_types) ? a.signal_types : [], summary: cleanText(summary, 200), timestamp: a.createdAt || '', scenarioId: id,
    })

    for (const sp of specialists) {
      const recs = Array.isArray(sp?.recommendations) ? sp.recommendations : []
      const topRec = recs[0]
      const findings = sp?.key_findings || ''
      const domain = (sp?.domain || '').toLowerCase()
      const urg = recs.some((r: any) => (r?.priority || '').toLowerCase() === 'critical') ? 'Critical' : recs.some((r: any) => (r?.priority || '').toLowerCase() === 'high') ? 'High' : 'Medium'

      signals.push({
        id, title: cleanText(findings, 70), brand: sp?.domain || 'Cross-brand', market: 'Global', urgency: urg,
        why: findings, nextStep: topRec?.action || 'Review full analysis', crossCutting: a.cross_cutting_themes || '', timestamp: a.createdAt || '',
        detailSections: [{ label: 'Key Findings', content: findings }, { label: 'Recommended Action', content: topRec?.action || 'See full analysis' }],
        relatedActions: recs.map((r: any) => ({ action: r?.action || '', priority: r?.priority || 'Medium', owner: 'Per analysis', rationale: r?.rationale || '' })),
      })

      if (types.includes('opportunity') || domain.includes('opportunity') || domain.includes('market') || domain.includes('trend')) {
        opportunities.push({ title: cleanText(findings, 70), brand: sp?.domain || 'Cross-brand', market: 'Global', why: findings, confidence: sp?.confidence || 'Medium', move: topRec?.action || '', scenarioId: id, detailSections: [{ label: 'Findings', content: findings }], relatedActions: recs.map((r: any) => ({ action: r?.action || '', priority: r?.priority || 'Medium', owner: 'Per analysis', rationale: r?.rationale || '' })) })
      }
      if (types.includes('launch') || domain.includes('launch') || domain.includes('performance')) {
        risks.push({ title: cleanText(findings, 70), brand: sp?.domain || 'Cross-brand', market: 'Global', severity: urg, cause: findings, action: topRec?.action || '', scenarioId: id, detailSections: [{ label: 'Findings', content: findings }], relatedActions: recs.map((r: any) => ({ action: r?.action || '', priority: r?.priority || 'Medium', owner: 'Per analysis', rationale: r?.rationale || '' })) })
      }
      if (types.includes('claims') || domain.includes('claims') || domain.includes('compliance') || domain.includes('reputation') || domain.includes('integrity')) {
        alerts.push({ title: cleanText(findings, 70), brand: sp?.domain || 'Cross-brand', market: 'Global', severity: urg, why: findings, response: topRec?.action || '', scenarioId: id, detailSections: [{ label: 'Findings', content: findings }], relatedActions: recs.map((r: any) => ({ action: r?.action || '', priority: r?.priority || 'Medium', owner: 'Per analysis', rationale: r?.rationale || '' })) })
      }
    }

    for (const pa of pActions) {
      actions.push({ title: pa?.action || '', priority: pa?.priority || 'Medium', owner: pa?.owner || 'TBD', impact: cleanText(summary, 120), timeline: 'Per analysis', scenarioId: id })
    }
  }

  signals.sort((a, b) => priorityOrder(a.urgency) - priorityOrder(b.urgency))
  actions.sort((a, b) => priorityOrder(a.priority) - priorityOrder(b.priority))
  return { signals, actions, opportunities, risks, alerts, recentAnalyses }
}

// ────────────────────────────────────────────────────────────────────────────
// Dashboard Component
// ────────────────────────────────────────────────────────────────────────────

export default function Dashboard({ analyses, loading, onNavigate, onViewAnalysis, onOpenDetail }: DashboardProps) {
  const safeAnalyses = Array.isArray(analyses) ? analyses : []
  const hasRealData = safeAnalyses.length > 0

  const derived = useMemo(() => deriveFromAnalyses(safeAnalyses), [safeAnalyses])

  // Merge: real derived data first, then seeded scenarios to fill gaps
  const displaySignals = [...derived.signals, ...SEEDED_SIGNALS].slice(0, 3)
  const displayActions = [...derived.actions, ...SEEDED_ACTIONS].slice(0, 6)
  const displayOpps = [...derived.opportunities, ...SEEDED_OPPORTUNITIES].slice(0, 3)
  const displayRisks = [...derived.risks, ...SEEDED_RISKS].slice(0, 2)
  const displayAlerts = [...derived.alerts, ...SEEDED_ALERTS].slice(0, 2)
  const displayRecentAnalyses = [...derived.recentAnalyses, ...SEEDED_ANALYSES].slice(0, 6)

  // KPIs based on actual state
  const allSignals = [...derived.signals, ...SEEDED_SIGNALS]
  const allRisks = [...derived.risks, ...SEEDED_RISKS]
  const allAlerts = [...derived.alerts, ...SEEDED_ALERTS]
  const criticalCount = allSignals.filter(s => s.urgency === 'Critical').length + allRisks.filter(r => r.severity === 'Critical').length + allAlerts.filter(a => a.severity === 'Critical').length
  const totalAnalyses = safeAnalyses.length + SEEDED_ANALYSES.length

  // ── Click handlers ──

  const openSignal = (sig: SeededSignal) => {
    onOpenDetail({
      category: 'signal', title: sig.title, brand: sig.brand, market: sig.market, severity: sig.urgency,
      sections: sig.detailSections.length > 0 ? sig.detailSections : [{ label: 'Why It Matters', content: sig.why }, { label: 'Recommended Next Step', content: sig.nextStep }],
      relatedActions: sig.relatedActions,
    })
  }

  const openAction = (act: SeededAction) => {
    onOpenDetail({
      category: 'action', title: act.title, severity: act.priority,
      sections: [{ label: 'Expected Impact', content: act.impact }, { label: 'Owner', content: act.owner }, { label: 'Timeline', content: act.timeline }],
    })
  }

  const openOpportunity = (opp: SeededOpportunity) => {
    onOpenDetail({
      category: 'opportunity', title: opp.title, brand: opp.brand, market: opp.market, severity: opp.confidence,
      sections: opp.detailSections.length > 0 ? opp.detailSections : [{ label: 'Why It Matters', content: opp.why }, { label: 'Suggested Move', content: opp.move }],
      relatedActions: opp.relatedActions,
    })
  }

  const openRisk = (risk: SeededRisk) => {
    onOpenDetail({
      category: 'risk', title: risk.title, brand: risk.brand, market: risk.market, severity: risk.severity,
      sections: risk.detailSections.length > 0 ? risk.detailSections : [{ label: 'Likely Cause', content: risk.cause }, { label: 'Immediate Action', content: risk.action }],
      relatedActions: risk.relatedActions,
    })
  }

  const openAlert = (alert: SeededAlert) => {
    onOpenDetail({
      category: 'alert', title: alert.title, brand: alert.brand, market: alert.market, severity: alert.severity,
      sections: alert.detailSections.length > 0 ? alert.detailSections : [{ label: 'Why It Matters', content: alert.why }, { label: 'Recommended Response', content: alert.response }],
      relatedActions: alert.relatedActions,
    })
  }

  const openRecentAnalysis = (ra: SeededAnalysis) => {
    // If it maps to a real analysis, open the full result view
    const real = safeAnalyses.find(a => a._id === ra.id)
    if (real) { onViewAnalysis(real); return }
    // Otherwise open as a detail view
    onOpenDetail({
      category: 'analysis', title: ra.title, brand: ra.brand, market: ra.market,
      sections: [{ label: 'Analysis Summary', content: ra.summary }],
    })
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {/* KPI Row */}
      <div className="px-8 pt-7 pb-2">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Time to Opportunity', value: hasRealData ? '< 2h' : '< 4h', sub: 'Avg. signal-to-insight speed', icon: RiTimeLine },
            { label: 'Time to First Action', value: hasRealData ? '< 8h' : '< 12h', sub: 'Avg. insight-to-recommendation', icon: RiFlashlightLine },
            { label: 'Analyses Generated', value: String(totalAnalyses), sub: `${safeAnalyses.length} live + ${SEEDED_ANALYSES.length} seeded`, icon: RiLineChartLine },
            { label: 'Open Critical Signals', value: String(criticalCount), sub: 'Require immediate attention', icon: RiAlertLine },
          ].map((kpi, i) => {
            const Icon = kpi.icon
            return (
              <div key={i} className="bg-card border border-border p-4">
                <div className="flex items-start justify-between mb-3">
                  <p className="text-[10px] tracking-[0.14em] text-muted-foreground uppercase leading-tight">{kpi.label}</p>
                  <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                <p className="text-2xl font-serif tracking-wide text-foreground">{kpi.value}</p>
                <p className="text-[10px] text-muted-foreground tracking-wide mt-1">{kpi.sub}</p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="px-8 pb-10 space-y-8 mt-4">

        {/* A. Priority Signals */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <RiAlertLine className="h-4 w-4 text-primary" />
            <h3 className="font-serif text-[15px] tracking-[0.1em] text-foreground uppercase">Priority Signals</h3>
            {hasRealData && <span className="text-[9px] text-primary tracking-[0.1em] uppercase ml-auto">Live</span>}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {displaySignals.map((sig, i) => (
              <button key={i} onClick={() => openSignal(sig)} className="bg-card border border-border p-5 flex flex-col text-left hover:border-primary/40 hover:bg-card/80 transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-serif text-[14px] tracking-wide text-foreground leading-snug pr-2 group-hover:text-primary transition-colors">{sig.title}</h4>
                  <span className={`text-[9px] tracking-[0.12em] uppercase px-2 py-0.5 whitespace-nowrap ${urgencyBadge(sig.urgency)}`}>{sig.urgency}</span>
                </div>
                <div className="flex gap-4 mb-3 text-[10px] text-muted-foreground tracking-[0.1em] uppercase">
                  <span>{sig.brand}</span><span className="text-border">|</span><span>{sig.market}</span>
                </div>
                <p className="text-[12px] text-foreground/70 leading-relaxed mb-3 flex-1">{cleanText(sig.why, 140)}</p>
                <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                  <div><p className="text-[10px] text-muted-foreground tracking-[0.1em] uppercase mb-1">Recommended Next Step</p><p className="text-[12px] text-primary leading-relaxed">{sig.nextStep}</p></div>
                  <RiArrowRightSLine className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* B. Recommended Actions */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <RiFlashlightLine className="h-4 w-4 text-primary" />
            <h3 className="font-serif text-[15px] tracking-[0.1em] text-foreground uppercase">Recommended Actions</h3>
            {hasRealData && <span className="text-[9px] text-primary tracking-[0.1em] uppercase ml-auto">Live</span>}
          </div>
          <div className="bg-card border border-border divide-y divide-border/60">
            {displayActions.map((act, i) => (
              <button key={i} onClick={() => openAction(act)} className="w-full flex items-start gap-5 px-5 py-4 text-left hover:bg-secondary/30 transition-colors group">
                <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${severityDot(act.priority)}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h4 className="text-[13px] text-foreground tracking-wide group-hover:text-primary transition-colors">{act.title}</h4>
                    <span className={`text-[9px] tracking-[0.12em] uppercase px-2 py-0.5 whitespace-nowrap flex-shrink-0 ${urgencyBadge(act.priority)}`}>{act.priority}</span>
                  </div>
                  <div className="flex gap-4 text-[10px] text-muted-foreground tracking-[0.1em] uppercase">
                    <span>{act.owner}</span><span className="text-border">|</span><span>{act.timeline}</span>
                  </div>
                  <p className="text-[11px] text-foreground/60 mt-1.5 leading-relaxed">{cleanText(act.impact, 120)}</p>
                </div>
                <RiArrowRightSLine className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
              </button>
            ))}
          </div>
        </section>

        {/* C. Active Opportunities */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <RiArrowRightUpLine className="h-4 w-4 text-primary" />
            <h3 className="font-serif text-[15px] tracking-[0.1em] text-foreground uppercase">Active Opportunities</h3>
            {hasRealData && <span className="text-[9px] text-primary tracking-[0.1em] uppercase ml-auto">Live</span>}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {displayOpps.map((opp, i) => (
              <button key={i} onClick={() => openOpportunity(opp)} className="bg-card border border-border p-5 text-left hover:border-primary/40 hover:bg-card/80 transition-all group">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-serif text-[14px] tracking-wide text-foreground leading-snug group-hover:text-primary transition-colors">{opp.title}</h4>
                  <span className="text-[9px] tracking-[0.12em] uppercase px-2 py-0.5 whitespace-nowrap ml-3 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">{opp.confidence}</span>
                </div>
                <div className="flex gap-4 mb-3 text-[10px] text-muted-foreground tracking-[0.1em] uppercase">
                  <span>{opp.brand}</span><span className="text-border">|</span><span>{opp.market}</span>
                </div>
                <p className="text-[12px] text-foreground/70 leading-relaxed mb-3">{cleanText(opp.why, 140)}</p>
                <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                  <div><p className="text-[10px] text-muted-foreground tracking-[0.1em] uppercase mb-1">Suggested Move</p><p className="text-[12px] text-primary leading-relaxed">{opp.move}</p></div>
                  <RiArrowRightSLine className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* D. Launch Risks */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <RiErrorWarningLine className="h-4 w-4 text-primary" />
            <h3 className="font-serif text-[15px] tracking-[0.1em] text-foreground uppercase">Launch Risks</h3>
            {hasRealData && <span className="text-[9px] text-primary tracking-[0.1em] uppercase ml-auto">Live</span>}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {displayRisks.map((risk, i) => (
              <button key={i} onClick={() => openRisk(risk)} className="bg-card border border-border p-5 text-left hover:border-primary/40 hover:bg-card/80 transition-all group">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-serif text-[14px] tracking-wide text-foreground leading-snug pr-2 group-hover:text-primary transition-colors">{risk.title}</h4>
                  <span className={`text-[9px] tracking-[0.12em] uppercase px-2 py-0.5 whitespace-nowrap ${urgencyBadge(risk.severity)}`}>{risk.severity}</span>
                </div>
                <div className="flex gap-4 mb-3 text-[10px] text-muted-foreground tracking-[0.1em] uppercase">
                  <span>{risk.brand}</span><span className="text-border">|</span><span>{risk.market}</span>
                </div>
                <p className="text-[10px] text-muted-foreground tracking-[0.1em] uppercase mb-1">Likely Cause</p>
                <p className="text-[12px] text-foreground/70 leading-relaxed mb-3">{cleanText(risk.cause, 160)}</p>
                <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                  <div><p className="text-[10px] text-muted-foreground tracking-[0.1em] uppercase mb-1">Immediate Action</p><p className="text-[12px] text-primary leading-relaxed">{risk.action}</p></div>
                  <RiArrowRightSLine className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* E. Claims / Reputation Alerts */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <RiShieldLine className="h-4 w-4 text-primary" />
            <h3 className="font-serif text-[15px] tracking-[0.1em] text-foreground uppercase">Claims / Reputation Alerts</h3>
            {hasRealData && <span className="text-[9px] text-primary tracking-[0.1em] uppercase ml-auto">Live</span>}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {displayAlerts.map((alert, i) => (
              <button key={i} onClick={() => openAlert(alert)} className="bg-card border border-border p-5 text-left hover:border-primary/40 hover:bg-card/80 transition-all group">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-serif text-[14px] tracking-wide text-foreground leading-snug pr-2 group-hover:text-primary transition-colors">{alert.title}</h4>
                  <span className={`text-[9px] tracking-[0.12em] uppercase px-2 py-0.5 whitespace-nowrap ${urgencyBadge(alert.severity)}`}>{alert.severity}</span>
                </div>
                <div className="flex gap-4 mb-3 text-[10px] text-muted-foreground tracking-[0.1em] uppercase">
                  <span>{alert.brand}</span><span className="text-border">|</span><span>{alert.market}</span>
                </div>
                <p className="text-[12px] text-foreground/70 leading-relaxed mb-3">{cleanText(alert.why, 160)}</p>
                <div className="pt-3 border-t border-border/60 flex items-center justify-between">
                  <div><p className="text-[10px] text-muted-foreground tracking-[0.1em] uppercase mb-1">Recommended Response</p><p className="text-[12px] text-primary leading-relaxed">{alert.response}</p></div>
                  <RiArrowRightSLine className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* F. Recent Analyses */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <RiFileTextLine className="h-4 w-4 text-primary" />
              <h3 className="font-serif text-[15px] tracking-[0.1em] text-foreground uppercase">Recent Analyses</h3>
            </div>
            <button onClick={() => onNavigate('history')} className="flex items-center gap-1 text-[11px] text-primary tracking-wide hover:text-primary/80 transition-colors">
              View all <RiArrowRightSLine className="h-3.5 w-3.5" />
            </button>
          </div>
          {loading ? (
            <div className="bg-card border border-border p-10 flex items-center justify-center">
              <div className="flex items-center gap-3 text-muted-foreground text-[12px] tracking-wide">
                <div className="w-4 h-4 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
                Loading intelligence...
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border divide-y divide-border/60">
              {displayRecentAnalyses.map((ra, idx) => (
                <button
                  key={ra.id + idx}
                  className="w-full text-left flex items-start gap-4 px-5 py-4 hover:bg-secondary/30 transition-colors group"
                  onClick={() => openRecentAnalysis(ra)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1.5">
                      <p className="text-[13px] text-foreground tracking-wide leading-snug group-hover:text-primary transition-colors">{ra.title}</p>
                      <span className="text-[9px] text-muted-foreground tracking-wide whitespace-nowrap flex-shrink-0 mt-0.5">
                        {ra.timestamp ? new Date(ra.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {ra.signalTypes.map((t, ti) => (
                        <span key={ti} className="text-[9px] tracking-[0.1em] uppercase text-primary border border-primary/30 px-1.5 py-0.5">{t}</span>
                      ))}
                      <span className="text-[9px] text-muted-foreground tracking-wide ml-1">{ra.brand} | {ra.market}</span>
                    </div>
                  </div>
                  <RiArrowRightSLine className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 mt-1" />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* New Signal CTA */}
        <div className="flex justify-center pt-2 pb-4">
          <button
            onClick={() => onNavigate('new-signal')}
            className="inline-flex items-center gap-2.5 bg-primary text-primary-foreground px-8 py-3 text-[12px] tracking-[0.15em] uppercase hover:bg-primary/90 transition-colors"
          >
            <RiRocketLine className="h-4 w-4" />
            Submit New Signal for Analysis
          </button>
        </div>
      </div>
    </div>
  )
}
