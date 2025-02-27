import React, { useState, useEffect } from 'react';
import { DollarSign, ChevronRight, Users, ArrowRight, MoreVertical, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Lead } from '../../types';

interface PipelineStage {
  id: string;
  name: string;
  color: string;
  leads: Lead[];
  value: number;
}

const stageColors = {
  new: 'bg-blue-500',
  contacted: 'bg-yellow-500',
  qualified: 'bg-purple-500',
  proposal: 'bg-indigo-500',
  closed: 'bg-green-500',
  lost: 'bg-red-500'
};

export default function SalesPipeline() {
  const [stages, setStages] = useState<PipelineStage[]>([
    { id: 'new', name: 'New Leads', color: stageColors.new, leads: [], value: 0 },
    { id: 'contacted', name: 'Contacted', color: stageColors.contacted, leads: [], value: 0 },
    { id: 'qualified', name: 'Qualified', color: stageColors.qualified, leads: [], value: 0 },
    { id: 'proposal', name: 'Proposal', color: stageColors.proposal, leads: [], value: 0 },
    { id: 'closed', name: 'Closed', color: stageColors.closed, leads: [], value: 0 }
  ]);
  const [loading, setLoading] = useState(true);
  const [draggedLead, setDraggedLead] = useState<Lead | null>(null);
  const [dragOverStage, setDragOverStage] = useState<string | null>(null);
  const [totalValue, setTotalValue] = useState(0);
  const [showLeadDetails, setShowLeadDetails] = useState<string | null>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  useEffect(() => {
    // Calculate total pipeline value
    const total = stages.reduce((sum, stage) => sum + stage.value, 0);
    setTotalValue(total);
  }, [stages]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .not('status', 'eq', 'lost');

      if (error) throw error;

      // Group leads by status
      const leadsByStatus = (data || []).reduce((acc, lead) => {
        const status = lead.status || 'new';
        if (!acc[status]) acc[status] = [];
        acc[status].push(lead);
        return acc;
      }, {} as Record<string, Lead[]>);

      // Calculate value for each stage
      const updatedStages = stages.map(stage => {
        const stageLeads = leadsByStatus[stage.id] || [];
        const stageValue = stageLeads.reduce((sum, lead) => sum + (lead.coverageAmount || 0), 0);
        return {
          ...stage,
          leads: stageLeads,
          value: stageValue
        };
      });

      setStages(updatedStages);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (lead: Lead) => {
    setDraggedLead(lead);
  };

  const handleDragOver = (e: React.DragEvent, stageId: string) => {
    e.preventDefault();
    setDragOverStage(stageId);
  };

  const handleDragLeave = () => {
    setDragOverStage(null);
  };

  const handleDrop = async (stageId: string) => {
    if (!draggedLead) return;

    // Don't do anything if dropping in the same stage
    if (draggedLead.status === stageId) {
      setDraggedLead(null);
      setDragOverStage(null);
      return;
    }

    try {
      // Update lead status in database
      const { error } = await supabase
        .from('leads')
        .update({ status: stageId })
        .eq('id', draggedLead.id);

      if (error) throw error;

      // Update local state
      const updatedStages = stages.map(stage => {
        if (stage.id === draggedLead.status) {
          // Remove from old stage
          const updatedLeads = stage.leads.filter(lead => lead.id !== draggedLead.id);
          const updatedValue = stage.value - (draggedLead.coverageAmount || 0);
          return { ...stage, leads: updatedLeads, value: updatedValue };
        }
        if (stage.id === stageId) {
          // Add to new stage
          const updatedLead = { ...draggedLead, status: stageId };
          const updatedLeads = [...stage.leads, updatedLead];
          const updatedValue = stage.value + (draggedLead.coverageAmount || 0);
          return { ...stage, leads: updatedLeads, value: updatedValue };
        }
        return stage;
      });

      setStages(updatedStages);
    } catch (error) {
      console.error('Error updating lead status:', error);
    } finally {
      setDraggedLead(null);
      setDragOverStage(null);
    }
  };

  const getStagePercentage = (stageValue: number) => {
    if (totalValue === 0) return 0;
    return (stageValue / totalValue) * 100;
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        Loading pipeline data...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Sales Pipeline</h2>
        <div className="flex space-x-2">
          <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
            <Plus className="h-4 w-4 mr-2 text-gray-500" />
            Add Lead
          </button>
          <button className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Pipeline Settings
          </button>
        </div>
      </div>

      {/* Pipeline Overview */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Pipeline Overview</h3>
        
        <div className="flex h-8 mb-6 rounded-lg overflow-hidden">
          {stages.map((stage) => (
            <div 
              key={stage.id}
              className={`${stage.color} h-full transition-all duration-500`}
              style={{ width: `${getStagePercentage(stage.value)}%` }}
              title={`${stage.name}: $${stage.value.toLocaleString()}`}
            />
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {stages.map((stage) => (
            <div key={stage.id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center mb-2">
                <div className={`w-3 h-3 rounded-full ${stage.color}`} />
                <span className="ml-2 text-sm font-medium text-gray-700">{stage.name}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Users className="h-4 w-4 text-gray-400 mr-1" />
                  <span className="text-sm text-gray-500">{stage.leads.length}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                  <span className="text-sm font-medium text-gray-900">${stage.value.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Kanban Board */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Pipeline Board</h3>
        
        <div className="flex space-x-4 overflow-x-auto pb-4">
          {stages.map((stage) => (
            <div 
              key={stage.id}
              className={`flex-1 min-w-[250px] ${dragOverStage === stage.id ? 'ring-2 ring-blue-500' : ''}`}
              onDragOver={(e) => handleDragOver(e, stage.id)}
              onDragLeave={handleDragLeave}
              onDrop={() => handleDrop(stage.id)}
            >
              <div className={`p-2 rounded-t-lg ${stage.color} bg-opacity-50`}>
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-center capitalize text-gray-900">{stage.name}</h4>
                  <span className="bg-white bg-opacity-90 text-xs font-medium px-2 py-1 rounded-full">
                    {stage.leads.length}
                  </span>
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-b-lg min-h-[400px] p-2 space-y-2">
                {stage.leads.length === 0 ? (
                  <div className="h-20 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-sm text-gray-400">Drop leads here</p>
                  </div>
                ) : (
                  stage.leads.map((lead) => (
                    <div 
                      key={lead.id}
                      className="bg-white p-3 rounded-lg shadow-sm cursor-move relative"
                      draggable
                      onDragStart={() => handleDragStart(lead)}
                      onClick={() => setShowLeadDetails(showLeadDetails === lead.id ? null : lead.id)}
                    >
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium text-gray-900">{lead.name}</h4>
                        <button className="p-1 hover:bg-gray-100 rounded-full">
                          <MoreVertical className="h-4 w-4 text-gray-400" />
                        </button>
                      </div>
                      
                      <div className="mt-2 flex justify-between items-center">
                        <span className="text-xs text-gray-500">{lead.policyType || 'No policy'}</span>
                        <span className="text-xs font-medium text-gray-900">
                          ${(lead.coverageAmount || 0).toLocaleString()}
                        </span>
                      </div>
                      
                      {showLeadDetails === lead.id && (
                        <div className="mt-3 pt-3 border-t border-gray-100">
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <p className="text-gray-500">Email:</p>
                              <p className="text-gray-900">{lead.email}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Phone:</p>
                              <p className="text-gray-900">{lead.phone}</p>
                            </div>
                            <div className="col-span-2">
                              <p className="text-gray-500">Source:</p>
                              <p className="text-gray-900 capitalize">{lead.source}</p>
                            </div>
                          </div>
                          
                          <div className="flex justify-end mt-2 space-x-2">
                            <button className="px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded">
                              Details
                            </button>
                            <button className="px-2 py-1 text-xs bg-blue-600 text-white rounded">
                              Contact
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pipeline Metrics */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Pipeline Metrics</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Conversion Rates</h4>
            <div className="space-y-3">
              {stages.slice(0, -1).map((stage, index) => {
                const nextStage = stages[index + 1];
                const conversionRate = nextStage.leads.length > 0 && stage.leads.length > 0
                  ? (nextStage.leads.length / stage.leads.length) * 100
                  : 0;
                
                return (
                  <div key={`${stage.id}-to-${nextStage.id}`}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center text-xs text-gray-500">
                        <span>{stage.name}</span>
                        <ArrowRight className="h-3 w-3 mx-1" />
                        <span>{nextStage.name}</span>
                      </div>
                      <span className="text-xs font-medium text-gray-900">{conversionRate.toFixed(1)}%</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full">
                      <div 
                        className={`h-1.5 ${stage.color} rounded-full`}
                        style={{ width: `${conversionRate}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Average Deal Size</h4>
            <div className="space-y-3">
              {stages.map((stage) => {
                const avgDealSize = stage.leads.length > 0
                  ? stage.value / stage.leads.length
                  : 0;
                
                return (
                  <div key={`avg-${stage.id}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">{stage.name}</span>
                      <span className="text-xs font-medium text-gray-900">${avgDealSize.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                    </div>
                    <div className="h-1.5 bg-gray-200 rounded-full">
                      <div 
                        className={`h-1.5 ${stage.color} rounded-full`}
                        style={{ width: `${(avgDealSize / 100000) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Pipeline Summary</h4>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500">Total Pipeline Value</p>
                <p className="text-xl font-semibold text-gray-900">${totalValue.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Leads</p>
                <p className="text-xl font-semibold text-gray-900">
                  {stages.reduce((sum, stage) => sum + stage.leads.length, 0)}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Closing Ratio</p>
                <p className="text-xl font-semibold text-gray-900">
                  {stages[0].leads.length > 0
                    ? `${((stages[4].leads.length / stages[0].leads.length) * 100).toFixed(1)}%`
                    : '0%'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}