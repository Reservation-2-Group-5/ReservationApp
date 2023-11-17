using Microsoft.EntityFrameworkCore;
using Reservation.Controllers;
using ReservationApp.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ReservationApp.Services
{
    public class RoomResService : IRoomResService
    {
        private readonly AppDbContext _context;

        public RoomResService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<RoomRes>> GetAllRoomReservationsAsync()
        {
            return await _context.Room_Res.ToListAsync();
        }

        

        public async Task<RoomRes> CreateRoomReservationAsync(RoomRes roomRes)
        {
            _context.Room_Res.Add(roomRes);
            await _context.SaveChangesAsync();
            return roomRes;
        }

        public async Task UpdateRoomReservationAsync(RoomRes roomRes)
        {
            _context.Entry(roomRes).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteRoomReservationAsync(int id)
        {
            var roomRes = await _context.Room_Res.FindAsync(id);
            if (roomRes != null)
            {
                _context.Room_Res.Remove(roomRes);
                await _context.SaveChangesAsync();
            }
        }

        public Task GetAllRoomReservations()
        {
            throw new NotImplementedException();
        }

        public Task<RoomResController> GetAllAsync()
        {
            throw new NotImplementedException();
        }

        public Task<RoomResController> GetUserByNetIDAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<RoomResController> DeleteAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task<RoomResController> SubmitAsync(RoomReservationDto roomReservationDto)
        {
            throw new NotImplementedException();
        }

        public Task<RoomRes> GetRoomReservationByIdAsync(int id)
        {
            throw new NotImplementedException();
        }
    }
}

