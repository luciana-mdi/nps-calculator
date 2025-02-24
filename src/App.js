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
      cacReduction: {
        description: "Expected percentage reduction in customer acquisition costs",
        estimation: "Calculate using:\n• Word-of-mouth acquisition costs vs paid\n• Referral program efficiency\n• Industry benchmark: 0.5-1.5% reduction"
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

  const InputField = ({ label, name, value, onChange, definition }) => {
    const [isTooltipVisible, setTooltipVisible] = useState(false);
    
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
                <strong>{definition?.description || "No description available"}</strong>
                <br /><br />
                {definition?.estimation || "No estimation guidance available"}
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
          This calculator is pre-populated with Delta Air Lines' 2023 metrics as a case study, using data from their annual report and financial statements. Delta was chosen because they are one of the largest global carriers with publicly available data and consistent financial reporting. Some metrics (like NPS and impact assumptions) use industry benchmarks where airline-specific data isn't public. Feel free to adjust any values to match your airline's specific metrics.
        </p>
      </div>
      
      <div style={styles.card}>>
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
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <h3 style={styles.sectionTitle}>Results - Value of 1 Point NPS Increase</h3>
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