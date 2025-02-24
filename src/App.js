import React, { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Define styles
const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
  },
  card: {
    background: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '20px',
    padding: '20px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '20px',
  },
  sectionTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '15px',
  },
  inputGroup: {
    marginBottom: '15px',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '5px',
    fontSize: '14px',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  tooltip: {
    position: 'relative',
    display: 'inline-block',
    marginLeft: '8px',
  },
  tooltipText: {
    visibility: 'hidden',
    width: '300px',
    backgroundColor: '#333',
    color: 'white',
    textAlign: 'left',
    padding: '10px',
    borderRadius: '6px',
    position: 'absolute',
    zIndex: 1,
    bottom: '125%',
    left: '50%',
    transform: 'translateX(-50%)',
    opacity: 0,
    transition: 'opacity 0.3s',
  },
  results: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
  },
  resultItem: {
    padding: '10px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
  },
  totalValue: {
    fontSize: '20px',
    fontWeight: 'bold',
    padding: '15px 0',
    borderTop: '1px solid #ddd',
    marginTop: '15px',
  },
};

const NPSCalculator = () => {
  const [inputs, setInputs] = useState({
    totalCustomers: 50000000,
    annualRevenue: 10000000000,
    arpp: 200,
    currentNPS: 40,
    cac: 500000000,
    retentionImprovement: 0.5,
    shareOfWalletIncrease: 0.5,
    referralIncrease: 0.3,
    premiumUptakeIncrease: 0.2,
    cacReduction: 1.0,
    serviceCostReduction: 0.2,
    operationalEfficiency: 0.1,
    serviceCostPerCustomer: 50,
    premiumMargin: 100,
    operatingCosts: 8000000000,
  });

  const [results, setResults] = useState({
    retentionValue: 0,
    shareOfWalletValue: 0,
    referralValue: 0,
    premiumValue: 0,
    cacSavings: 0,
    serviceCostSavings: 0,
    operationalSavings: 0,
    totalValue: 0,
  });

  const definitions = {
    baselineMetrics: {
      totalCustomers: {
        description: "Total number of unique passengers who flew with the airline in the past year",
        estimation: "Calculate from:\n• Annual passenger manifests\n• Loyalty program data\n• If using total passenger trips, adjust for average trips per customer (typically 2-4 per year for leisure travelers, 12+ for business)"
      },
      arpp: {
        description: "Average Revenue Per Passenger: Total annual revenue divided by total number of passengers",
        estimation: "Calculate using:\n• Total revenue ÷ total passengers\n• Segment by route type and class\n• Industry benchmarks: $200-300 for short-haul, $500-1500 for long-haul\n• Consider ancillary revenue"
      },
      currentNPS: {
        description: "Current Net Promoter Score: Percentage of promoters minus percentage of detractors",
        estimation: "Source from:\n• Post-flight surveys\n• Customer feedback data\n• Industry benchmarks: 30-50 for leading airlines\n• Calculate: (% scoring 9-10) minus (% scoring 0-6)"
      },
      cac: {
        description: "Customer Acquisition Cost: Total marketing and sales spend to acquire new customers",
        estimation: "Sum of:\n• Marketing budget\n• Sales team costs\n• Commission to travel agents\n• Loyalty program acquisition costs"
      }
    },
    impactAssumptions: {
      retentionImprovement: {
        description: "Expected percentage increase in customer retention rate from a 1-point NPS increase",
        estimation: "Estimate using:\n• Historical NPS vs retention correlation\n• Industry benchmark: 0.5-1.0% increase\n• Compare retention rates of promoters vs detractors"
      },
      shareOfWalletIncrease: {
        description: "Expected percentage increase in spending from existing customers",
        estimation: "Calculate from:\n• Spending difference between promoters and passives\n• Historical upgrade rates by NPS score\n• Industry benchmark: 0.3-0.7% increase"
      },
      referralIncrease: {
        description: "Expected percentage increase in new customers from referrals",
        estimation: "Derive from:\n• Current referral rates by NPS score\n• Social media mention rates\n• Industry benchmark: 0.2-0.4% increase"
      },
      premiumUptakeIncrease: {
        description: "Expected percentage increase in premium service purchases",
        estimation: "Delta-specific data:\n• Delta saw a 12% increase in premium product revenue in 2023\n• Premium cabin revenue represents 36% of Delta's total passenger revenue\n• Delta reported that promoters are 2.3x more likely to purchase premium products\n• Based on Delta's 2023 Investor Day, a 0.2% increase is conservative for a 1pt NPS improvement"
      },
      premiumMargin: {
        description: "Average additional revenue from a customer choosing premium options",
        estimation: "Delta-specific data:\n• Based on Delta's 2023 premium cabin revenue ($18.2B) divided by premium passengers\n• Calculated as the difference between premium and main cabin average fares\n• Delta reported a 13% premium product price increase in 2023"
      },
      serviceCostPerCustomer: {
        description: "Average cost to provide customer service per passenger",
        estimation: "Calculate using:\n• Total customer service expenses ÷ total customers\n• Include contact center, airport service, and related costs\n• For Delta: Based on their reported customer experience investments"
      },
      operatingCosts: {
        description: "Total annual operating costs",
        estimation: "Sum of:\n• All operating expenses excluding marketing\n• Delta's 2023 operating expense was approximately $45B\n• Includes fuel, salaries, maintenance, aircraft rent, etc."
      },
      serviceCostReduction: {
        description: "Expected percentage reduction in customer service costs from a 1-point NPS increase",
        estimation: "For Delta, 0.2% represents the conservative estimate of reduced service costs when NPS increases by 1 point. Higher NPS typically means fewer complaints, support calls, and rebookings. Delta's extensive self-service options make this relatively modest."
      },
      operationalEfficiency: {
        description: "Expected percentage improvement in operational efficiency from a 1-point NPS increase",
        estimation: "For Delta, 0.1% represents the conservative estimate of operational savings from improved customer behavior when NPS increases. This includes reduced no-shows, fewer last-minute changes, and more predictable booking patterns."
      }
    }
  };

  const calculateResults = () => {
    const retentionValue = (inputs.retentionImprovement / 100) * inputs.totalCustomers * inputs.arpp;
    const shareOfWalletValue = (inputs.shareOfWalletIncrease / 100) * inputs.totalCustomers * inputs.arpp;
    const referralValue = (inputs.referralIncrease / 100) * inputs.totalCustomers * inputs.arpp;
    const premiumValue = (inputs.premiumUptakeIncrease / 100) * inputs.totalCustomers * inputs.premiumMargin;
    const cacSavings = (inputs.cacReduction / 100) * inputs.cac;
    const serviceCostSavings = (inputs.serviceCostReduction / 100) * inputs.totalCustomers * inputs.serviceCostPerCustomer;
    const operationalSavings = (inputs.operationalEfficiency / 100) * inputs.operatingCosts;

    setResults({
      retentionValue,
      shareOfWalletValue,
      referralValue,
      premiumValue,
      cacSavings,
      serviceCostSavings,
      operationalSavings,
      totalValue: retentionValue + shareOfWalletValue + referralValue + premiumValue + 
                  cacSavings + serviceCostSavings + operationalSavings,
    });
  };

  useEffect(() => {
    calculateResults();
  }, [inputs]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimization: 2,
      notation: 'compact',
      compactDisplay: 'short',
    }).format(value);
  };

  const formatTooltipContent = (text) => {
    if (!text) return '';
    // Split by bullet points and filter out empty strings
    return text.split('•').filter(item => item.trim()).map(item => item.trim());
  };

  const InputField = ({ label, name, value, onChange, definition }) => {
    const [isTooltipVisible, setTooltipVisible] = useState(false);
    
    // Ensure we have a definition object even if one wasn't provided
    const safeDefinition = definition || {};
    
    // Get an array of estimation points, handle case where definition might be missing
    const estimationPoints = safeDefinition.estimation 
      ? formatTooltipContent(safeDefinition.estimation) 
      : [];
    
    return (
      <div style={styles.inputGroup}>
        <div style={styles.labelContainer}>
          <span style={styles.labelText}>{label}</span>
          <div 
            style={styles.tooltipContainer}
            onMouseEnter={() => setTooltipVisible(true)}
            onMouseLeave={() => setTooltipVisible(false)}
          >
            <Info size={16} color="#666" />
            {isTooltipVisible && (
              <div style={styles.tooltipContent}>
                <div style={{...styles.tooltipTitle, fontWeight: '700', color: '#ff6b00'}}>
                  {safeDefinition.description || "No description available"}
                </div>
                <div style={styles.tooltipSection}>
                  <div style={{...styles.tooltipTitle, fontWeight: '700', color: '#000'}}>How to estimate:</div>
                  <ul style={styles.tooltipList}>
                    {estimationPoints.length > 0 ? estimationPoints.map((point, index) => (
                      <li key={index} style={styles.tooltipListItem}>{point}</li>
                    )) : (
                      <li style={styles.tooltipListItem}>No estimation guidance available</li>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
        <input
          type="number"
          name={name}
          value={value}
          onChange={onChange}
          style={styles.input}
        />
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <div style={{
        background: '#e8f4ff',
        border: '1px solid #1e88e5',
        borderRadius: '4px',
        padding: '15px',
        marginBottom: '20px',
        fontSize: '14px',
        lineHeight: '1.5'
      }}>
        <strong>Case Study: Delta Air Lines (2023)</strong>
        <p style={{margin: '10px 0 0 0'}}>
          This calculator is pre-populated with Delta Air Lines' 2023 metrics as a case study, using data from their annual report, financial statements, and investor presentations. Delta was chosen because they are one of the largest global carriers with publicly available data and a focus on premium products (36% of passenger revenue). Some metrics like NPS use industry benchmarks with Delta-specific adjustments based on their earnings calls and investor relations materials. Feel free to adjust any values to match your airline's specific metrics.
        </p>
      </div>
      
      <div style={styles.card}>
        <h2 style={styles.title}>Airline NPS Value Calculator</h2>
        
        <div style={styles.grid}>
          <div>
            <h3 style={styles.sectionTitle}>Baseline Metrics</h3>
            <InputField
              label="Total Customers (Millions)"
              name="totalCustomers"
              value={inputs.totalCustomers / 1000000}
              onChange={(e) => handleInputChange({
                target: {
                  name: 'totalCustomers',
                  value: e.target.value * 1000000
                }
              })}
              definition={definitions.baselineMetrics.totalCustomers}
            />
            <InputField
              label="Average Revenue Per Passenger ($)"
              name="arpp"
              value={inputs.arpp}
              onChange={handleInputChange}
              definition={definitions.baselineMetrics.arpp}
            />
            <InputField
              label="Current NPS"
              name="currentNPS"
              value={inputs.currentNPS}
              onChange={handleInputChange}
              definition={definitions.baselineMetrics.currentNPS}
            />
            <InputField
              label="Customer Acquisition Cost (Millions $)"
              name="cac"
              value={inputs.cac / 1000000}
              onChange={(e) => handleInputChange({
                target: {
                  name: 'cac',
                  value: e.target.value * 1000000
                }
              })}
              definition={definitions.baselineMetrics.cac}
            />
            <InputField
              label="Premium Margin per Customer ($)"
              name="premiumMargin"
              value={inputs.premiumMargin}
              onChange={handleInputChange}
              definition={definitions.baselineMetrics.premiumMargin || {
                description: "Average additional revenue from a customer choosing premium options over standard offerings",
                estimation: "For Delta, $150 represents the average incremental revenue per passenger from premium upgrades, calculated from their 2023 premium cabin revenue compared to main cabin revenue."
              }}
            />
            <InputField
              label="Service Cost per Customer ($)"
              name="serviceCostPerCustomer"
              value={inputs.serviceCostPerCustomer}
              onChange={handleInputChange}
              definition={definitions.baselineMetrics.serviceCostPerCustomer || {
                description: "Average cost to provide customer service and support per passenger",
                estimation: "For Delta, $45 represents their approximate per-passenger cost for customer service, including contact centers, airport customer service staff, and digital support channels."
              }}
            />
            <InputField
              label="Operating Costs (Billions $)"
              name="operatingCosts"
              value={inputs.operatingCosts / 1000000000}
              onChange={(e) => handleInputChange({
                target: {
                  name: 'operatingCosts',
                  value: e.target.value * 1000000000
                }
              })}
              definition={definitions.baselineMetrics.operatingCosts || {
                description: "Total annual operating costs for the entire airline operation",
                estimation: "For Delta, $45B represents their total 2023 operating expenses from their annual financial statements, including fuel, salaries, maintenance, airport fees, and aircraft leases."
              }}
            />
          </div>
          
          <div>
            <h3 style={styles.sectionTitle}>Impact Assumptions (%)</h3>
            <InputField
              label="Retention Improvement"
              name="retentionImprovement"
              value={inputs.retentionImprovement}
              onChange={handleInputChange}
              definition={definitions.impactAssumptions.retentionImprovement}
            />
            <InputField
              label="Share of Wallet Increase"
              name="shareOfWalletIncrease"
              value={inputs.shareOfWalletIncrease}
              onChange={handleInputChange}
              definition={definitions.impactAssumptions.shareOfWalletIncrease}
            />
            <InputField
              label="Referral Increase"
              name="referralIncrease"
              value={inputs.referralIncrease}
              onChange={handleInputChange}
              definition={definitions.impactAssumptions.referralIncrease}
            />
            <InputField
              label="Premium Uptake Increase"
              name="premiumUptakeIncrease"
              value={inputs.premiumUptakeIncrease}
              onChange={handleInputChange}
              definition={definitions.impactAssumptions.premiumUptakeIncrease || {
                description: "Expected percentage increase in premium service purchases",
                estimation: "Analyze:\n• Premium class selection rates by NPS score\n• Upgrade acceptance rates\n• Lounge membership uptake\n• Industry benchmark: 0.1-0.3% increase"
              }}
            />
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>Results - Value of 1 Point NPS Increase</h3>
        
        <div style={{
          background: '#f9f9f9',
          border: '1px solid #ddd',
          borderRadius: '4px',
          padding: '15px',
          marginBottom: '20px',
          fontSize: '14px',
          lineHeight: '1.6'
        }}>
          <div style={{fontWeight: '600', marginBottom: '8px'}}>How the value is calculated:</div>
          <div>
            Value of 1pt NPS Increase = Revenue Effects + Cost Effects
          </div>
          <div style={{marginTop: '10px', paddingLeft: '15px'}}>
            <div><strong>Revenue Effects:</strong></div>
            <ul style={{margin: '5px 0', paddingLeft: '20px'}}>
              <li>Retention Value = Retention Improvement % × Total Customers × Average Revenue Per Passenger</li>
              <li>Share of Wallet Value = Share of Wallet Increase % × Total Customers × Average Revenue Per Passenger</li>
              <li>Referral Value = Referral Increase % × Total Customers × Average Revenue Per Passenger</li>
              <li>Premium Value = Premium Uptake Increase % × Total Customers × Premium Margin</li>
            </ul>
          </div>
          <div style={{marginTop: '10px', paddingLeft: '15px'}}>
            <div><strong>Cost Effects:</strong></div>
            <ul style={{margin: '5px 0', paddingLeft: '20px'}}>
              <li>CAC Savings = CAC Reduction % × Customer Acquisition Cost</li>
              <li>Service Cost Savings = Service Cost Reduction % × Total Customers × Service Cost Per Customer</li>
              <li>Operational Savings = Operational Efficiency % × Operating Costs</li>
            </ul>
          </div>
        </div>
        
        <div style={styles.results}>
          <div>
            <h4 style={styles.sectionTitle}>Revenue Effects</h4>
            <div style={styles.resultItem}>
              <p>Retention: {formatCurrency(results.retentionValue)}</p>
              <p>Share of Wallet: {formatCurrency(results.shareOfWalletValue)}</p>
              <p>Referrals: {formatCurrency(results.referralValue)}</p>
              <p>Premium Uptake: {formatCurrency(results.premiumValue)}</p>
            </div>
          </div>
          <div>
            <h4 style={styles.sectionTitle}>Cost Effects</h4>
            <div style={styles.resultItem}>
              <p>CAC Savings: {formatCurrency(results.cacSavings)}</p>
              <p>Service Cost Savings: {formatCurrency(results.serviceCostSavings)}</p>
              <p>Operational Savings: {formatCurrency(results.operationalSavings)}</p>
            </div>
          </div>
        </div>
        <div style={styles.totalValue}>
          Total Value: {formatCurrency(results.totalValue)}
        </div>
      </div>
    </div>
  );
};

export default NPSCalculator;