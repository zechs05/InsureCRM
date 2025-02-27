import React, { useState, useRef } from 'react';
import { Upload, X, AlertCircle, CheckCircle, FileText, Download } from 'lucide-react';
import { parse } from 'date-fns';
import type { Contact, TeamMember } from '../../types';

interface ImportContactsProps {
  onClose: () => void;
  onImport: (contacts: Contact[]) => void;
  teamMembers: TeamMember[];
}

interface ImportError {
  row: number;
  errors: string[];
}

const sampleData = `Name,Email,Phone,Coverage,Date of Birth,Smoker,Source,Notes
John Smith,john.s@example.com,(555) 123-4567,Term Life - $500000,1985-06-15,No,manual,Looking for family coverage
Sarah Davis,sarah.d@example.com,(555) 987-6543,Auto Insurance - $100000,1990-03-20,Yes,referral,Interested in comprehensive coverage`;

export default function ImportContacts({ onClose, onImport, teamMembers }: ImportContactsProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string[][]>([]);
  const [importing, setImporting] = useState(false);
  const [errors, setErrors] = useState<ImportError[]>([]);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadSampleCSV = () => {
    const blob = new Blob([sampleData], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'sample_contacts.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const validateRow = (row: { [key: string]: string }, rowIndex: number): string[] => {
    const errors: string[] = [];

    // Required fields
    if (!row.Name?.trim()) errors.push('Name is required');
    if (!row.Email?.trim()) errors.push('Email is required');
    if (!row['Date of Birth']?.trim()) errors.push('Date of Birth is required');

    // Email format
    if (row.Email && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(row.Email)) {
      errors.push('Invalid email format');
    }

    // Phone format (optional but if provided should be valid)
    if (row.Phone && !/^\(\d{3}\) \d{3}-\d{4}$/.test(row.Phone)) {
      errors.push('Phone number should be in format (555) 123-4567');
    }

    // Date of Birth validation
    try {
      if (row['Date of Birth']) {
        const dob = parse(row['Date of Birth'], 'yyyy-MM-dd', new Date());
        if (isNaN(dob.getTime())) throw new Error();
      }
    } catch {
      errors.push('Date of Birth should be in YYYY-MM-DD format');
    }

    // Smoker validation
    if (row.Smoker && !['Yes', 'No'].includes(row.Smoker)) {
      errors.push('Smoker should be either "Yes" or "No"');
    }

    // Source validation
    const validSources = ['manual', 'facebook', 'referral', 'website', 'other'];
    if (row.Source && !validSources.includes(row.Source.toLowerCase())) {
      errors.push(`Source should be one of: ${validSources.join(', ')}`);
    }

    return errors;
  };

  const calculateAge = (dob: string): number => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset states
    setFile(file);
    setPreview([]);
    setErrors([]);
    setSuccess(false);

    // Check file type
    if (!file.name.endsWith('.csv')) {
      setErrors([{ row: 0, errors: ['Only CSV files are supported'] }]);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const lines = text.split('\n').map(line => 
        line.split(',').map(cell => cell.trim().replace(/^"|"$/g, ''))
      );
      
      // Show preview of first 5 rows
      setPreview(lines.slice(0, 6));
    };
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setErrors([]);

    try {
      const text = await file.text();
      const lines = text.split('\n').map(line => 
        line.split(',').map(cell => cell.trim().replace(/^"|"$/g, ''))
      );

      const headers = lines[0];
      const rows = lines.slice(1).filter(row => row.some(cell => cell.trim()));

      const importErrors: ImportError[] = [];
      const importedContacts: Contact[] = [];

      rows.forEach((row, index) => {
        const rowData: { [key: string]: string } = {};
        headers.forEach((header, i) => {
          rowData[header] = row[i] || '';
        });

        const rowErrors = validateRow(rowData, index + 1);
        if (rowErrors.length > 0) {
          importErrors.push({ row: index + 1, errors: rowErrors });
          return;
        }

        const age = calculateAge(rowData['Date of Birth']);
        
        const contact: Contact = {
          id: `contact-${Date.now()}-${index}`,
          name: rowData.Name,
          email: rowData.Email,
          phone: rowData.Phone || '',
          coverage: rowData.Coverage || '',
          age,
          dateOfBirth: rowData['Date of Birth'],
          smoker: rowData.Smoker?.toLowerCase() === 'yes',
          source: (rowData.Source?.toLowerCase() || 'import') as any,
          notes: rowData.Notes || '',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };

        importedContacts.push(contact);
      });

      if (importErrors.length > 0) {
        setErrors(importErrors);
        return;
      }

      onImport(importedContacts);
      setSuccess(true);
      setTimeout(() => onClose(), 1500);
    } catch (error) {
      console.error('Error importing contacts:', error);
      setErrors([{ row: 0, errors: ['Failed to process file'] }]);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Import Contacts</h3>
              <p className="text-sm text-gray-500">Import contacts from a CSV file</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {!file && (
            <div className="text-center">
              <div 
                className="max-w-xl mx-auto p-12 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-xl font-medium text-gray-900">Choose a file or drag and drop</p>
                <p className="mt-2 text-sm text-gray-500">CSV files only</p>
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".csv"
                className="hidden"
              />
              <div className="mt-4">
                <button
                  onClick={downloadSampleCSV}
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download sample CSV template
                </button>
              </div>
            </div>
          )}

          {file && (
            <>
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">{file.name}</h4>
                  <p className="text-sm text-gray-500">{file.size} bytes</p>
                </div>
                <button
                  onClick={() => {
                    setFile(null);
                    setPreview([]);
                    setErrors([]);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>
              </div>

              {preview.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Preview</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          {preview[0].map((header, i) => (
                            <th
                              key={i}
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {preview.slice(1).map((row, i) => (
                          <tr key={i}>
                            {row.map((cell, j) => (
                              <td key={j} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center mb-2">
                    <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                    <h4 className="text-sm font-medium text-red-800">Import Errors</h4>
                  </div>
                  <ul className="space-y-2">
                    {errors.map((error, i) => (
                      <li key={i} className="text-sm text-red-700">
                        {error.row === 0 ? (
                          error.errors[0]
                        ) : (
                          <>Row {error.row}: {error.errors.join(', ')}</>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                    <p className="text-sm text-green-700">Contacts imported successfully!</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          {file && !success && (
            <button
              onClick={handleImport}
              disabled={importing || errors.length > 0}
              className={`flex items-center px-4 py-2 rounded-lg text-white transition-colors ${
                importing || errors.length > 0
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              <Upload className="h-5 w-5 mr-2" />
              {importing ? 'Importing...' : 'Import Contacts'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}