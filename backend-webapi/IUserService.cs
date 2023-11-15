using Reservation.Controllers;
using ReservationApp.Models;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace ReservationApp.Services
{
    public interface IUserService
    {
        Task<IEnumerable<User>> GetAllUsersAsync();
        Task<User> GetUserByIdAsync(long netId);
        Task<User> CreateUserAsync(User user);
        Task UpdateUserAsync(User user);
        Task DeleteUserAsync(long netId);
        Task<User> GetUserByNetIDAsync(long NetID);
        Task<RoomResController> GetAsync(object NetID);
    }

    public class UserService : IUserService
    {
        private readonly AppDbContext _context;

        public UserService(AppDbContext context)
        {
            _context = context;
        }

        public Task<User> CreateUserAsync(User user)
        {
            throw new NotImplementedException();
        }

        public Task DeleteUserAsync(long netId)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<User>> GetAllUsersAsync()
        {
            return await _context.User.ToListAsync();
        }

        public Task GetAsync(object netID)
        {
            throw new NotImplementedException();
        }

        public Task<User> GetUserByIdAsync(long netId)
        {
            throw new NotImplementedException();
        }

        public Task<User> GetUserByNetIDAsync(long NetID)
        {
            throw new NotImplementedException();
        }

        public Task UpdateUserAsync(User user)
        {
            throw new NotImplementedException();
        }

        Task<RoomResController> IUserService.GetAsync(object NetID)
        {
            throw new NotImplementedException();
        }
    }
}