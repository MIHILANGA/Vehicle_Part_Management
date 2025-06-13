import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import { FiSearch, FiPlus, FiEdit, FiTrash2, FiArrowLeft, FiFilter, FiHome } from 'react-icons/fi';
import styled from 'styled-components';

// ========== STYLED COMPONENTS ==========
const AppContainer = styled.div`
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f7fa;
  color: #333;
  min-height: 100vh;
`;

const Navbar = styled.nav`
  background-color: #2c3e50;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: #ecf0f1;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
`;

const NavLink = styled(Link)`
  color: #ecf0f1;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    color: #3498db;
  }
`;

const MainContent = styled.main`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const Button = styled.button`
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background-color 0.3s;

  &:hover {
    background-color: #2980b9;
  }
`;

const SecondaryButton = styled(Button)`
  background-color: transparent;
  color: #3498db;
  border: 1px solid #3498db;

  &:hover {
    background-color: rgba(52, 152, 219, 0.1);
  }
`;

const PartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const PartCard = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  transition: transform 0.3s, box-shadow 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  }
`;

const PartInfo = styled.div`
  padding: 1.2rem;
`;

const PartID = styled.span`
  display: inline-block;
  background-color: #f1f1f1;
  color: #777;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
`;

const PartName = styled.h3`
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  color: #2c3e50;
`;

const PartDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  color: #555;
  font-size: 0.9rem;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  margin-top: 0.5rem;
  background-color: ${props => 
    props.status === 'In Stock' ? '#d4edda' : 
    props.status === 'Low Stock' ? '#fff3cd' : '#f8d7da'};
  color: ${props => 
    props.status === 'In Stock' ? '#155724' : 
    props.status === 'Low Stock' ? '#856404' : '#721c24'};
`;

const PartsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  th, td {
    padding: 1rem;
    text-align: left;
    border-bottom: 1px solid #eee;
  }

  th {
    background-color: #f8f9fa;
    font-weight: 600;
    color: #555;
  }

  tr:hover {
    background-color: #f8f9fa;
  }
`;

const IconButton = styled.button`
  background: ${props => props.danger ? 'rgba(220, 53, 69, 0.1)' : 'rgba(13, 110, 253, 0.1)'};
  color: ${props => props.danger ? '#dc3545' : '#0d6efd'};
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
  margin-right: 0.5rem;

  &:hover {
    background: ${props => props.danger ? 'rgba(220, 53, 69, 0.2)' : 'rgba(13, 110, 253, 0.2)'};
  }
`;

const FilterSection = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 2rem;
  background-color: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
`;

const Label = styled.label`
  font-weight: 500;
  color: #555;
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  color: #333;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const FormContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormRow = styled.div`
  display: flex;
  gap: 1.5rem;

  & > * {
    flex: 1;
  }
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background-color: white;
  color: #333;
  font-size: 1rem;

  &:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const SearchContainer = styled.div`
  margin-bottom: 2rem;
`;

const SearchInput = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);

  input {
    background: transparent;
    border: none;
    color: #333;
    padding: 0.5rem;
    font-size: 1rem;
    width: 100%;
    outline: none;

    &::placeholder {
      color: #999;
    }
  }
`;

const FilterPanel = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const ResultsCount = styled.div`
  color: #666;
  margin-bottom: 1rem;
  font-size: 0.9rem;
`;

// ========== COMPONENTS ==========
const HomePage = () => {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    partType: '',
    status: ''
  });

  const fetchParts = async () => {
    try {
      let url = 'http://localhost:5000/parts?';
      if (filters.partType) url += `partType=${filters.partType}&`;
      if (filters.status) url += `status=${filters.status}&`;
      
      const res = await axios.get(url);
      setParts(res.data);
    } catch (error) {
      console.error("Error fetching parts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchParts(); }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <PageHeader>
        <h1>Vehicle Parts Inventory</h1>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <NavLink to="/parts/add">
            <Button>
              <FiPlus /> Add Part
            </Button>
          </NavLink>
          <NavLink to="/parts">
            <SecondaryButton>
              <FiFilter /> Advanced Search
            </SecondaryButton>
          </NavLink>
        </div>
      </PageHeader>

      <FilterSection>
        <FilterGroup>
          <Label>Part Type</Label>
          <Select 
            name="partType" 
            value={filters.partType} 
            onChange={handleFilterChange}
          >
            <option value="">All Types</option>
            <option value="Engine">Engine</option>
            <option value="Transmission">Transmission</option>
            <option value="Brakes">Brakes</option>
            <option value="Suspension">Suspension</option>
            <option value="Electrical">Electrical</option>
            <option value="Body">Body</option>
          </Select>
        </FilterGroup>

        <FilterGroup>
          <Label>Availability</Label>
          <Select 
            name="status" 
            value={filters.status} 
            onChange={handleFilterChange}
          >
            <option value="">All Statuses</option>
            <option value="In Stock">In Stock</option>
            <option value="Low Stock">Low Stock</option>
            <option value="Out of Stock">Out of Stock</option>
          </Select>
        </FilterGroup>
      </FilterSection>

      <PartsGrid>
        {parts.map(part => (
          <PartCard key={part.id}>
            <PartInfo>
              <PartID>#{part.id}</PartID>
              <PartName>{part.name}</PartName>
              <PartDetails>
                <span><strong>Brand:</strong> {part.brand}</span>
                <span><strong>Type:</strong> {part.partType}</span>
                <span><strong>Qty:</strong> {part.quantity}</span>
                <span><strong>Price:</strong> ${part.price.toFixed(2)}</span>
                <StatusBadge status={part.status}>
                  {part.status}
                </StatusBadge>
              </PartDetails>
            </PartInfo>
          </PartCard>
        ))}
      </PartsGrid>
    </>
  );
};

const PartListPage = () => {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchParts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/parts');
      setParts(res.data);
    } catch (error) {
      console.error("Error fetching parts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchParts(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this part?")) {
      await axios.delete(`http://localhost:5000/parts/${id}`);
      fetchParts();
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <PageHeader>
        <h1>Parts Management</h1>
        <Button as={Link} to="/parts/add">
          <FiPlus /> Add Part
        </Button>
      </PageHeader>

      <PartsTable>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Part Type</th>
            <th>Brand</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {parts.map(part => (
            <tr key={part.id}>
              <td>#{part.id}</td>
              <td>{part.name}</td>
              <td>{part.partType}</td>
              <td>{part.brand}</td>
              <td>{part.quantity}</td>
              <td>${part.price.toFixed(2)}</td>
              <td>
                <StatusBadge status={part.status}>
                  {part.status}
                </StatusBadge>
              </td>
              <td>
                <IconButton onClick={() => navigate(`/parts/edit/${part.id}`)}>
                  <FiEdit />
                </IconButton>
                <IconButton danger onClick={() => handleDelete(part.id)}>
                  <FiTrash2 />
                </IconButton>
              </td>
            </tr>
          ))}
        </tbody>
      </PartsTable>
    </>
  );
};

const PartForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const [form, setForm] = useState({ 
    name: '', 
    partType: '', 
    brand: '',
    quantity: 0, 
    price: 0,
    status: 'In Stock'
  });

  useEffect(() => {
    if (isEditing) {
      const fetchPart = async () => {
        const res = await axios.get(`http://localhost:5000/parts/${id}`);
        setForm(res.data);
      };
      fetchPart();
    }
  }, [id, isEditing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/parts/${id}`, form);
      } else {
        await axios.post('http://localhost:5000/parts', form);
      }
      navigate('/parts');
    } catch (error) {
      console.error("Error saving part:", error);
    }
  };

  const updateStatus = (quantity) => {
    if (quantity > 10) return 'In Stock';
    if (quantity > 0) return 'Low Stock';
    return 'Out of Stock';
  };

  const handleQuantityChange = (e) => {
    const quantity = parseInt(e.target.value);
    setForm({
      ...form,
      quantity,
      status: updateStatus(quantity)
    });
  };

  return (
    <>
      <PageHeader>
        <SecondaryButton as={Link} to={isEditing ? "/parts" : "/"}>
          <FiArrowLeft /> Back to {isEditing ? "Parts List" : "Home"}
        </SecondaryButton>
        <h1>{isEditing ? 'Edit Part' : 'Add New Part'}</h1>
        <div style={{ width: '120px' }}></div>
      </PageHeader>

      <FormContainer>
        <Form onSubmit={handleSubmit}>
          <FilterGroup>
            <Label>Part Name</Label>
            <Input 
              value={form.name} 
              onChange={e => setForm({...form, name: e.target.value})} 
              required 
            />
          </FilterGroup>

          <FormRow>
            <FilterGroup>
              <Label>Part Type</Label>
              <Select 
                value={form.partType} 
                onChange={e => setForm({...form, partType: e.target.value})}
                required
              >
                <option value="">Select Type</option>
                <option value="Engine">Engine</option>
                <option value="Transmission">Transmission</option>
                <option value="Brakes">Brakes</option>
                <option value="Suspension">Suspension</option>
                <option value="Electrical">Electrical</option>
                <option value="Body">Body</option>
              </Select>
            </FilterGroup>

            <FilterGroup>
              <Label>Brand</Label>
              <Input 
                value={form.brand} 
                onChange={e => setForm({...form, brand: e.target.value})} 
                required 
              />
            </FilterGroup>
          </FormRow>

          <FormRow>
            <FilterGroup>
              <Label>Quantity</Label>
              <Input 
                type="number" 
                min="0"
                value={form.quantity} 
                onChange={handleQuantityChange} 
                required 
              />
            </FilterGroup>

            <FilterGroup>
              <Label>Price ($)</Label>
              <Input 
                type="number" 
                step="0.01" 
                min="0"
                value={form.price} 
                onChange={e => setForm({...form, price: parseFloat(e.target.value)})} 
                required 
              />
            </FilterGroup>
          </FormRow>

          <FilterGroup>
            <Label>Status</Label>
            <Select 
              value={form.status} 
              onChange={e => setForm({...form, status: e.target.value})}
              required
            >
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </Select>
          </FilterGroup>

          <ButtonGroup>
            <Button type="submit">
              {isEditing ? 'Update Part' : 'Add Part'}
            </Button>
            <SecondaryButton as={Link} to={isEditing ? "/parts" : "/"}>
              Cancel
            </SecondaryButton>
          </ButtonGroup>
        </Form>
      </FormContainer>
    </>
  );
};

const SearchFilterPage = () => {
  const [parts, setParts] = useState([]);
  const [filters, setFilters] = useState({
    name: '',
    partType: '',
    brand: '',
    status: '',
    minPrice: '',
    maxPrice: ''
  });

  const fetchParts = async () => {
    let url = 'http://localhost:5000/parts?';
    if (filters.name) url += `name_like=${filters.name}&`;
    if (filters.partType) url += `partType=${filters.partType}&`;
    if (filters.brand) url += `brand_like=${filters.brand}&`;
    if (filters.status) url += `status=${filters.status}&`;
    if (filters.minPrice) url += `price_gte=${filters.minPrice}&`;
    if (filters.maxPrice) url += `price_lte=${filters.maxPrice}&`;
    
    const res = await axios.get(url);
    setParts(res.data);
  };

  useEffect(() => { fetchParts(); }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <PageHeader>
        <h1>Advanced Search</h1>
        <Button as={Link} to="/parts/add">
          <FiPlus /> Add Part
        </Button>
      </PageHeader>

      <SearchContainer>
        <SearchInput>
          <FiSearch />
          <input 
            type="text" 
            name="name" 
            placeholder="Search by part name..." 
            value={filters.name} 
            onChange={handleFilterChange} 
          />
        </SearchInput>
      </SearchContainer>

      <FilterPanel>
        <h3>Filters</h3>
        <FormRow>
          <FilterGroup>
            <Label>Part Type</Label>
            <Select 
              name="partType" 
              value={filters.partType} 
              onChange={handleFilterChange}
            >
              <option value="">All Types</option>
              <option value="Engine">Engine</option>
              <option value="Transmission">Transmission</option>
              <option value="Brakes">Brakes</option>
              <option value="Suspension">Suspension</option>
              <option value="Electrical">Electrical</option>
              <option value="Body">Body</option>
            </Select>
          </FilterGroup>

          <FilterGroup>
            <Label>Brand</Label>
            <Input 
              type="text" 
              name="brand" 
              placeholder="Filter by brand..." 
              value={filters.brand} 
              onChange={handleFilterChange} 
            />
          </FilterGroup>

          <FilterGroup>
            <Label>Status</Label>
            <Select 
              name="status" 
              value={filters.status} 
              onChange={handleFilterChange}
            >
              <option value="">All Statuses</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </Select>
          </FilterGroup>
        </FormRow>

        <FormRow>
          <FilterGroup>
            <Label>Min Price</Label>
            <Input 
              type="number" 
              name="minPrice" 
              placeholder="$0.00" 
              value={filters.minPrice} 
              onChange={handleFilterChange} 
              step="0.01" 
              min="0"
            />
          </FilterGroup>

          <FilterGroup>
            <Label>Max Price</Label>
            <Input 
              type="number" 
              name="maxPrice" 
              placeholder="$1000.00" 
              value={filters.maxPrice} 
              onChange={handleFilterChange} 
              step="0.01" 
              min="0"
            />
          </FilterGroup>
        </FormRow>
      </FilterPanel>

      <ResultsCount>{parts.length} parts found</ResultsCount>

      <PartsTable>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Brand</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {parts.map(part => (
            <tr key={part.id}>
              <td>#{part.id}</td>
              <td>{part.name}</td>
              <td>{part.partType}</td>
              <td>{part.brand}</td>
              <td>{part.quantity}</td>
              <td>${part.price.toFixed(2)}</td>
              <td>
                <StatusBadge status={part.status}>
                  {part.status}
                </StatusBadge>
              </td>
            </tr>
          ))}
        </tbody>
      </PartsTable>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContainer>
        <Navbar>
          <Logo>AutoParts Manager</Logo>
          <NavLinks>
            <NavLink to="/">
              <FiHome /> Home
            </NavLink>
            <NavLink to="/parts">
              <FiFilter /> Parts List
            </NavLink>
            <NavLink to="/parts/add">
              <FiPlus /> Add Part
            </NavLink>
          </NavLinks>
        </Navbar>

        <MainContent>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/parts" element={<PartListPage />} />
            <Route path="/parts/add" element={<PartForm />} />
            <Route path="/parts/edit/:id" element={<PartForm />} />
            <Route path="/search" element={<SearchFilterPage />} />
          </Routes>
        </MainContent>
      </AppContainer>
    </Router>
  );
};

export default App;